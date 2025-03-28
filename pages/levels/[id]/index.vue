<script setup lang="ts">
import { ResourceState } from '#build/urql-client/codegen/default/graphql'

const route = useRoute()
const levelId = route.params.id.toString()

const { isLogin, toLogin, user, isModerator } = useAuth()

const query = gql(`
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
const updateRateMutation = gql(`
  mutation LevelRate($uid: String!, $rating: Int) {
    rateLevel(id: $uid, rating: $rating) {
      average
      total
      distribution
      rating
    }
  }
`)
const addToLabMutation = gql(`
  mutation AddToLibrary($levelId: Int!) {
    addToLibrary(levelId: $levelId)
  }
`)
const removeFromLibMutation = gql(`
  mutation RemoveFromLibrary($levelId: Int!) {
    removeFromLibrary(levelId: $levelId)
  }
`)

const { data: levelData, error } = await useAsyncQuery(query, {
  uid: levelId,
})
if (levelId && !levelData.value?.level) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Level not found: ${levelId}`,
  }))
}
else if (levelData.value?.level?.state === ResourceState.Public) {
  useSWR()
}

const isQualified = computed(() => !!levelData.value?.level?.category.includes('qualified'))
const isFeatured = computed(() => !!levelData.value?.level?.category.includes('featured'))

const ratingDownCount = computed(() => {
  return levelData.value?.level?.rating.distribution
    .slice(0, 5)
    .reduce((a, b) => a + b, 0) ?? 0
})

const ratingUpCount = computed(() => {
  return levelData.value?.level?.rating.distribution
    .slice(5, 10)
    .reduce((a, b) => a + b, 0) ?? 0
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
    try {
      const token = await verify()
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

const { isIos, isAndroid, isMacOS, isApple } = useDevice()
const isMobile = computed(() => {
  return isAndroid || isIos || isMacOS || isApple
})
const downloadCytoidDialog = ref<HTMLDialogElement | null>(null)
async function openWithCytoid() {
  const url = `cytoid://levels/${levelData.value!.level!.uid}`
  if (import.meta.client && window?.location) {
    window.location.href = url
  }
  downloadCytoidDialog.value?.showModal()
}

// rating
const updateRateLoading = ref(false)
async function updateRate(v: number) {
  updateRateLoading.value = true

  if (v <= 0) {
    await removeRate()
    updateRateLoading.value = false
    return
  }
  else if (v > 10) {
    updateRateLoading.value = false
    return
  }

  const res = await useMutation(updateRateMutation, {
    uid: levelId,
    rating: v,
  }).catch((e) => {
    handleErrorToast(e)
    userRating.value = 0
  })

  if (res) {
    levelData.value!.level!.rating = res.rateLevel
  }
  updateRateLoading.value = false

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
      <p v-if="levelData?.level?.metadata.artist" class="pt-6 text-xl">
        {{ levelData?.level?.metadata.artist.name }}
      </p>
      <div class="flex max-w-xl flex-wrap gap-2 py-6">
        <template v-for="chart in levelData?.level?.charts" :key="chart.type">
          <LevelDiffBadge :type="chart.type" :difficulty="chart.difficulty" :name="chart.name ?? undefined" :notes-count="chart.notesCount" />
        </template>
      </div>
      <div class="flex flex-wrap gap-3">
        <button v-if="isMobile" class="btn btn-accent" @click="openWithCytoid">
          <Icon name="ph:circle-duotone" size="24" class="mr-2" />
          Cytoid
        </button>
        <Captcha v-slot="{ verify }">
          <button class="btn btn-primary" @click="downloadLevel(verify)">
            <Icon name="material-symbols:download-sharp" size="24" class="mr-2" />
            {{ $t('level_details.download_btn', { size: formatSize(levelData?.level?.size) }) }}
          </button>
        </Captcha>
        <div ref="downloadCtl" class="hidden" />
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
            v-if="levelData?.level?.owner?.id === user?.id || isModerator"
            :to="{ name: 'levels-id-manage', params: { uid: levelData?.level?.uid } }"
          >
            <button class="btn btn-neutral">
              <Icon name="mdi:briefcase" size="24" class="mr-2" />
              {{ $t('general.manage_btn') }}
            </button>
          </NuxtLink>
        </template>
      </div>
      <div v-if="levelData?.level?.state === 'UNLISTED'" class="alert alert-info mt-6 shadow-lg">
        <Icon name="mdi:eye-off-outline" size="24" />
        <span>{{ $t('level_details.message_unlisted') }}</span>
      </div>
      <div v-else-if="levelData?.level?.state === 'PRIVATE'" class="alert alert-warning mt-6 shadow-lg">
        <Icon name="mdi:lock-outline" size="24" />
        <span>{{ $t('level_details.message_private') }}</span>
      </div>
      <div v-else-if="levelData?.level?.censored" class="alert alert-error mt-6 shadow-lg">
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
          <div class="prose prose-sm mt-4 max-w-none" v-html="marked(levelData?.level?.description ?? '')" />
          <p class="card-subtitle pt-6">
            {{ $t('level_details.details_card_tags_title') }}
          </p>
          <div v-if="levelData?.level?.tags.length && levelData?.level?.tags.length > 0">
            <NuxtLink
              v-for="tag in levelData?.level?.tags"
              :key="tag"
              class="badge badge-neutral my-1 mr-2 max-w-full select-none"
              :href="`/levels?tags=${tag.toLowerCase()}`"
            >
              <span class="truncate" v-text="tag" />
            </NuxtLink>
          </div>
          <div v-else class="select-none opacity-60">
            None
          </div>
          <template v-if="isQualified || isFeatured">
            <p class="card-subtitle pt-6">
              {{ $t('level_details.details_card_categories_title') }}
            </p>
            <div class="grid w-fit grid-flow-col gap-2">
              <div v-if="levelData.level.category.includes('featured')" class="category-badge-featured badge badge-lg">
                Featured
              </div>
              <div v-if="levelData.level.category.includes('qualified')" class="category-badge-qualified badge badge-lg">
                Qualified
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="card mt-5 w-full bg-base-100 shadow-xl">
        <div class="card-body">
          <p class="card-subtitle flex items-center gap-2">
            {{ $t('level_details.details_card_rating_title') }}
            <span class="badge badge-neutral badge-sm">
              {{ levelData?.level?.rating.total }}
            </span>
          </p>
          <div class="stats stats-horizontal flex select-none">
            <div
              :class="{
                'flex-1': !(ratingUpCount > ratingDownCount),
              }"
              class="stat flex w-2/5 items-end justify-center"
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
              class="stat flex w-2/5 items-end justify-center"
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
            <div class="mt-2 flex select-none rounded-full bg-gray-500/20 px-4 py-3">
              <span class="aspect-square h-8 overflow-hidden rounded-full">
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
              <button v-if="updateRateLoading" class="btn btn-circle btn-ghost loading btn-sm" />
              <button v-else :disabled="!userRating" class="btn btn-circle btn-ghost btn-sm" @click="updateRate(0)">
                <Icon name="mdi:delete-outline" size="23" />
              </button>
            </div>
          </template>
        </div>
      </div>
      <div class="card mt-5 w-full bg-base-100 shadow-xl">
        <div class="card-body gap-6">
          <MetaBox v-if="levelData.level.metadata" :metadata="levelData?.level?.metadata" />

          <div class="flex flex-col gap-2">
            <p class="card-subtitle">
              Id
            </p>
            <a
              class="cursor-pointer text-2xl decoration-primary/80 underline-offset-4 hover:underline "
              @click="copyToClipboard(levelData!.level!.uid, 'level id')"
            >
              {{ levelData.level.uid }}<Icon name="mdi:content-copy" size="18" class="ml-2" />
            </a>
          </div>
        </div>
      </div>
      <div class="card mt-5 w-full bg-base-100 shadow-xl">
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

  <dialog ref="downloadCytoidDialog" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="text-lg font-bold">
        Launching Cytoid...
      </h3>
      <p class="py-4">
        Don't have Cytoid on your device yet? Download Cytoid now!
      </p>
      <div class="modal-action">
        <button class="btn btn-square btn-neutral">
          <Icon name="mdi:close" size="18" />
        </button>
        <NuxtLink class="btn btn-primary flex-1" :to="{ name: 'download' }">
          Download Cytoid
        </NuxtLink>
      </div>
    </form>
  </dialog>
</template>
