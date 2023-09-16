<script setup lang="ts">
const route = useRoute()

const { isLogin, toLogin, user } = useAuth()

const levelId = route.params.id.toString()

const query = gql(/* GraphQL */`
  query FetchLevel($uid: String!){
    level(uid: $uid) {
      id
      uid
      title
      description
      state
      censored
      size
      tags
      category
      creationDate
      modificationDate
      owned
      owner {
        id
        uid
        name
        avatar { large }
      }
      charts {
        difficulty
        type
        name
        notesCount
      }
      metadata {
        artist {
          name
          localized_name
          url
        }
        illustrator {
          name
          localized_name
          url
        }
        charter {
          name
          localized_name
          url
        }
        storyboarder {
          name
          localized_name
          url
        }
      }
      rating {
        average
        total
        distribution
        rating
      }
      bundle {
        musicPreview
        backgroundImage {
          original
        }
      }
    }
  }
`)
const updateRateMutation = gql(/* GraphQL */`
  mutation LevelRate($uid: String!, $rating: Int) {
    rateLevel(id: $uid, rating: $rating) {
      average
      total
      distribution
      rating
    }
  }
`)
const addToLabMutation = gql(/* GraphQL */`
  mutation AddToLibrary($levelId: Int!) {
    addToLibrary(levelId: $levelId)
  }
`)
const removeFromLibMutation = gql(/* GraphQL */`
  mutation RemoveFromLibrary($levelId: Int!) {
    removeFromLibrary(levelId: $levelId)
  }
`)

const { data: levelData, error } = await useAsyncData(() => useQuery(query, {
  uid: levelId,
}))
if (levelId && !levelData.value?.level) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Level not found: ${levelId}`,
  }))
}

const isQualified = computed(() => !!levelData.value?.level?.category.includes('qualified'))
const isFeatured = computed(() => !!levelData.value?.level?.category.includes('featured'))

const ratingDownCount = computed(() => {
  return levelData.value?.level?.rating.distribution
    .slice(0, 5).reduce((a, b) => a + b, 0) ?? 0
})

const ratingUpCount = computed(() => {
  return levelData.value?.level?.rating.distribution
    .slice(5, 10).reduce((a, b) => a + b, 0) ?? 0
})

const userRating = ref(levelData.value?.level?.rating.rating ?? 0)
watch(userRating, (val) => {
  updateRate(val)
})

// Download
const downloadLink = ref('')
const downloadCtl = ref<HTMLDivElement | null>(null)
async function downloadLevel(verify: () => Promise<string>) {
  if (!isLogin.value) {
    toLogin()
    return
  }

  if (downloadLink.value === '') {
    const token = await verify()
    try {
      const { data: res } = await useServiceFetch<levelDownloadResponse>(`/levels/${levelId}/resources`, {
        method: 'POST',
        body: {
          captcha: token,
        },
      })
      downloadLink.value = res.value?.package ?? ''
    }
    catch (e: unknown) {
      errorAlert((e as Error).message)
    }
  }

  if (downloadLink.value !== '' && document) {
    const downloadDom = document.createElement('a')
    downloadDom.href = downloadLink.value
    downloadDom.download = `${levelData.value?.level?.uid}.cytoidlevel`
    downloadCtl.value?.appendChild(downloadDom)
    downloadDom.click()
    downloadCtl.value?.removeChild(downloadDom)
  }
}

// rating
const updateRateLoading = ref(false)
async function updateRate(v: number) {
  if (v <= 0) {
    updateRateLoading.value = true
    await removeRate()
    updateRateLoading.value = false
    return
  }
  else if (v > 10) {
    return
  }

  const res = await useMutation(updateRateMutation, {
    uid: levelId,
    rating: v,
  })

  if (res) {
    levelData.value!.level!.rating = res.rateLevel
  }

  async function removeRate() {
    userRating.value = 0
    const { data: res } = await useServiceFetch<RatingResponse>(`/levels/${levelId}/ratings`, {
      method: 'POST',
    })
    if (res.value) {
      levelData.value!.level!.rating = {
        ...res.value,
        rating: 0,
      }
    }
  }
}

// update library functions
const libLoading = ref(false)
async function addToLib() {
  libLoading.value = true
  if (!levelData.value?.level?.id) {
    return
  }
  await useMutation(addToLabMutation, {
    levelId: levelData.value?.level?.id,
  })
  levelData.value.level.owned = false
  libLoading.value = false
  successAlert('Level added to Library')
}
async function removeFromLib() {
  libLoading.value = true
  if (!levelData.value?.level?.id) {
    return
  }
  await useMutation(removeFromLibMutation, {
    levelId: levelData.value?.level?.id,
  })
  levelData.value.level.owned = null
  libLoading.value = false
  successAlert('Level removed from favorites', {
    type: 'error',
  })
}

function formatSize(size: number) {
  return formatBytes(size)
}

// (DANGEROUS) TODO: it is a dirty way to fix vue router bug, need to remove it once vue router fixed
onMounted(() => {
  nextTick(() => {
    // if there a space in levelId
    if (levelId.includes(' ')) {
      const route = useRoute()
      const router = useRouter()
      // magic
      const err = router.push({
        ...route,
        force: true,
      })
      if (err) {
        console.error(err)
      }
      console.error('The level id contains space')
    }
  })
})

defineCytoidPage({
  title: levelData.value?.level?.title ? `${levelData.value?.level?.title}` : 'Level',
  background: levelData.value?.level?.bundle?.backgroundImage?.original ?? undefined,
  preview: levelData.value?.level?.bundle?.musicPreview ?? undefined,
}, {
  unsafeDescription: levelData.value?.level?.description,
  author: levelData.value?.level?.owner?.name ?? levelData.value?.level?.owner?.uid ?? undefined,
})
</script>

<template>
  <LayoutContent v-if="levelData?.level">
    <template #contentTitle>
      <h1 class="text-5xl font-bold">
        {{ levelData?.level?.title }}
      </h1>
      <p v-if="levelData?.level?.metadata.artist" class="text-xl pt-6">
        {{ levelData?.level?.metadata.artist.name }}
      </p>
      <div class="py-6 flex gap-2 flex-wrap max-w-xl">
        <template v-for="chart in levelData?.level?.charts" :key="chart.type">
          <LevelDiffBadge :type="chart.type" :difficulty="chart.difficulty" :name="chart.name ?? undefined" :notes-count="chart.notesCount" />
        </template>
      </div>
      <div class="flex gap-3 flex-wrap max-w-xl">
        <Captcha v-slot="{ verify }">
          <button class="btn btn-primary" @click="downloadLevel(verify)">
            <Icon name="material-symbols:download-sharp" size="24" class="mr-2" />
            {{ $t('level_details.download_btn', { size: formatSize(levelData?.level?.size) }) }}
          </button>
          <div ref="downloadCtl" class="hidden" />
        </Captcha>
        <template v-if="isLogin">
          <button
            v-if="levelData?.level?.owned === null"
            class="btn btn-secondary"
            :class="{
              loading: libLoading,
            }"
            @click="addToLib"
          >
            <Icon name="material-symbols:favorite-outline" size="24" class="mr-2" />
            {{ $t('general.favorite_verb') }}
          </button>
          <button
            v-else-if="levelData?.level?.owned === false"
            :class="{
              loading: libLoading,
            }"
            class="btn btn-error"
            @click="removeFromLib"
          >
            <Icon name="material-symbols:favorite" size="24" class="mr-2" />
            {{ $t('general.favorite_pass_tense') }}
          </button>
          <button v-else-if="levelData?.level?.owned === true" class="btn btn-success" style="--tw-bg-opacity:0.8" disabled>
            <Icon name="material-symbols:check-circle" size="24" class="mr-2" />
            OWNED
          </button>

          <NuxtLink
            v-if="levelData?.level?.owner?.id === user?.id || user?.role === 'admin' || user?.role === 'moderator'"
            :to="{ name: 'levels-id-manage', params: { uid: levelData?.level?.uid } }"
          >
            <button class="btn btn-neutral">
              <Icon name="mdi:briefcase" size="24" class="mr-2" />
              {{ $t('general.manage_btn') }}
            </button>
          </NuxtLink>
        </template>
      </div>
      <div v-if="levelData?.level?.state === 'UNLISTED'" class="alert alert-info shadow-lg mt-6">
        <Icon name="mdi:eye-off-outline" size="24" />
        <span>{{ $t('level_details.message_unlisted') }}</span>
      </div>
      <div v-else-if="levelData?.level?.state === 'PRIVATE'" class="alert alert-warning shadow-lg mt-6">
        <Icon name="mdi:lock-outline" size="24" />
        <span>{{ $t('level_details.message_private') }}</span>
      </div>
      <div v-else-if="levelData?.level?.censored" class="alert alert-error shadow-lg mt-6">
        <Icon name="mdi:exclamation-thick" size="24" />
        <span>{{ $t('level_details.message_censored', { reason: levelData?.level?.censored }) }}</span>
      </div>
    </template>

    <template #subContent>
      <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body">
          <UserAuthor
            v-if="levelData?.level?.owner"
            :avatar="levelData?.level?.owner.avatar.large ?? undefined"
            :name="levelData?.level?.owner.name || levelData?.level?.owner.uid || 'Unknown'"
            :uid="levelData?.level?.owner.uid ?? undefined"
          />
          <div class="prose prose-sm max-w-none mt-4" v-html="useMarked(levelData?.level?.description ?? '')" />
          <p class="card-subtitle pt-6">
            {{ $t('level_details.details_card_tags_title') }}
          </p>
          <div v-if="levelData?.level?.tags.length && levelData?.level?.tags.length > 0">
            <NuxtLink
              v-for="tag in levelData?.level?.tags"
              :key="tag"
              class="badge badge-neutral select-none mr-2 my-1 max-w-full"
              :href="`/levels?tags=${tag.toLowerCase()}`"
            >
              <span class="truncate" v-text="tag" />
            </NuxtLink>
          </div>
          <div v-else class="opacity-60 select-none">
            None
          </div>
          <template v-if="isQualified || isFeatured">
            <p class="card-subtitle pt-6">
              {{ $t('level_details.details_card_categories_title') }}
            </p>
            <div class="grid grid-flow-col w-fit gap-2">
              <div v-if="levelData.level.category.includes('featured')" class="badge badge-lg category-badge-featured">
                Featured
              </div>
              <div v-if="levelData.level.category.includes('qualified')" class="badge badge-lg category-badge-qualified">
                Qualified
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="card w-full bg-base-100 shadow-xl mt-5">
        <div class="card-body">
          <p class="card-subtitle flex items-center gap-2">
            {{ $t('level_details.details_card_rating_title') }}
            <span class="badge badge-sm badge-neutral">
              {{ levelData?.level?.rating.total }}
            </span>
          </p>
          <div class="stats stats-horizontal flex select-none">
            <div
              :class="{
                'flex-1': !(ratingUpCount > ratingDownCount),
              }"
              class="stat w-2/5 flex justify-center items-end"
            >
              <div class="stat-value text-center text-2xl">
                <p
                  v-if="ratingDownCount > 0"
                  :class="{
                    'text-4xl': ratingDownCount > ratingUpCount,
                  }"
                  class="text-orange-300"
                >
                  <Icon name="material-symbols:keyboard-arrow-down-rounded" />
                  {{ ratingDownCount }}
                </p>
                <p v-else>
                  -
                </p>
              </div>
            </div>

            <div
              :class="{
                'flex-1': !(ratingDownCount > ratingUpCount),
              }"
              class="stat w-2/5 flex justify-center items-end"
            >
              <div class="stat-value text-center text-2xl">
                <p
                  v-if="ratingUpCount > 0"
                  :class="{
                    'text-4xl': ratingUpCount > ratingDownCount,
                  }"
                  class="text-blue-300"
                >
                  <Icon name="material-symbols:keyboard-arrow-up-rounded" />{{ ratingUpCount }}
                </p>
                <p v-else>
                  -
                </p>
              </div>
            </div>
          </div>

          <template v-if="isLogin">
            <div class="flex py-3 px-4 mt-2 bg-gray-500/20 rounded-full select-none">
              <span class="aspect-square rounded-full overflow-hidden h-8">
                <img :src="avatarURL(user?.id)">
              </span>
              <div class="flex-1" />
              <div class="rating rating-half items-center">
                <input v-model="userRating" type="radio" name="rating-10" :value="0" class="rating-hidden">
                <input
                  v-for="i in 10" :key="i"
                  v-model="userRating" type="radio" name="rating-10" :value="i"
                  :class="`bg-yellow-600 mask mask-star-2 ${i % 2 ? 'mask-half-1' : 'mask-half-2'}`"
                >
              </div>
              <div class="flex-1" />
              <button v-if="updateRateLoading" class="btn btn-circle btn-ghost btn-sm loading" />
              <button v-else :disabled="!userRating" class="btn btn-circle btn-ghost btn-sm" @click="updateRate(0)">
                <Icon name="mdi:delete-outline" size="23" />
              </button>
            </div>
          </template>
        </div>
      </div>
      <div class="card w-full bg-base-100 shadow-xl mt-5">
        <div class="card-body gap-6">
          <MetaBox v-if="levelData?.level?.metadata" :metadata="levelData?.level?.metadata" />

          <div class="flex flex-col gap-2">
            <p class="card-subtitle">
              Id
            </p>
            <a
              class="text-2xl cursor-pointer hover:underline underline-offset-4 decoration-primary/80 "
              @click="copyToClipboard(levelData.level.uid, 'level id')"
            >
              {{ levelData.level.uid }}<Icon name="mdi:content-copy" size="18" class="ml-2" />
            </a>
          </div>
        </div>
      </div>
      <div class="card w-full bg-base-100 shadow-xl mt-5">
        <div class="card-body gap-6">
          <div class="flex flex-col gap-2">
            <p class="card-subtitle">
              {{ $t('level_details.details_card_last_updated_title') }}
            </p>
            <p>
              {{
                dateFormatCalendar(levelData?.level?.modificationDate)
              }}, {{
                dateFromNow(levelData?.level?.modificationDate)
              }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <!-- Leaderboard -->
    <LevelLeaderboard
      v-if="levelData?.level?.uid"
      class="shadow-xl"
      :level-id="levelData?.level?.uid"
      :charts="levelData.level.charts.map(item => {
        return {
          difficulty: item.difficulty,
          type: item.type,
          name: item.name ?? undefined,
          notesCount: item.notesCount,
        }
      })"
    />

    <!-- Comment -->
    <CommentThread
      v-if="levelData?.level?.uid"
      category="level"
      :thread="levelData?.level?.uid"
    />
  </LayoutContent>
</template>
