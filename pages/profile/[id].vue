<script setup lang="ts">
import { addMinutes, isFuture, parseISO } from 'date-fns'
import type { LevelInfoFragment } from 'gql/graphql'

const [defineStatItem, StatItem] = createReusableTemplate<{
  title: string
  data: string | number
}>()

const route = useRoute()
const { user } = useAuth()
const profileId = route.params.id.toString()

const hiddenProfile = ref(false)

const selectChart = ref<'activity' | 'rating' | 'accuracy'>('rating')

const query = gql(/* GraphQL */`
  query FetchProfilePage($uid: String!) {
    profile(uid: $uid) {
      bio
      header {
        original
      }
      user {
        id
        uid
        name
        active
        registrationDate
        avatar {
          large
        }
        collections(first: 2) {
          id
          uid
          cover {
            thumbnail
          }
          title
          slogan
          levelCount
          creationDate
        }
        collectionsCount
        lastSeen
        levelsCount(category: "!featured")
        featuredLevelsCount: levelsCount(category: "featured")
        levels(category: "!featured", first: 6, sort: MODIFICATION_DATE, order: DESC) { ...LevelInfo }
        featuredLevels: levels(category: "featured", first: 6, sort: MODIFICATION_DATE, order: DESC) { ...LevelInfo }
      }
      rating
      badges {
        uid
        title
        description
        metadata
      }
      recentRecords(limit: 10) {
        id
        date
        chart {
          id
          difficulty
          name
          type
          notesCount
          level {
            uid
            title
            bundle {
              backgroundImage {
                stripe
              }
            }
          }
        }
        score
        accuracy
      }
      exp {
        totalExp
        currentLevelExp
        nextLevelExp
        currentLevel
      }
      activity {
        totalRankedPlays
        totalRankedScore
        clearedNotes
        maxCombo
        averageRankedAccuracy
        totalPlayTime
      }
      timeseries {
        count
        cumulativeAccuracy
        cumulativeRating
        week
        year
      }
    }
  }
  fragment LevelInfo on UserLevel{
    id
    uid
    title
    metadata {
      title_localized
      artist {
        name
      }
    }
    bundle {
      backgroundImage {
        thumbnail
      }
      music
      musicPreview
    }
    charts {
      type
      difficulty
      name
      notesCount
    }
  }
`)

const { data: profileData, error } = await useAsyncData(() => useQuery(query, {
  uid: profileId,
}))
if (profileId && !profileData.value?.profile) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: `Profile not found: ${profileId}`,
  }))
}
if (profileData.value?.profile?.user?.active === false) {
  showError(error.value?.message ?? createError({
    statusCode: 403,
    statusMessage: `The user got banned: ${profileId}.`,
  }))
  hiddenProfile.value = true
}

const online = computed(() => {
  if (!profileData.value?.profile?.user?.lastSeen) {
    return false
  }
  const date = parseISO(profileData.value?.profile?.user?.lastSeen)
  const dateInFuture = addMinutes(date, 15)
  return isFuture(dateInFuture) // If last seen date + 15 min is in the future, then we're online
})

const eventBadges = computed(() => {
  const badges = profileData.value?.profile?.badges ?? []
  const ans = badges.filter((badge) => {
    if (!badge.metadata.imageUrl) {
      return false
    }
    for (const upBadge of badges) {
      if (upBadge.metadata?.overrides && Array.isArray(upBadge.metadata?.overrides)
        && upBadge.metadata?.overrides.includes(badge.uid)) {
        return false
      }
    }
    return true
  })
  return ans
})

const faBadges = computed(() => {
  const badges = profileData.value?.profile?.badges ?? []
  return badges.filter(b => b.metadata?.fontawesome)
})

const lastSeen = computed<string>(() => {
  if (!profileData.value?.profile?.user?.lastSeen) {
    return 'Unknown'
  }
  return dateFromNow(profileData.value?.profile?.user?.lastSeen)
})

const registrationDate = computed<string>(() => {
  if (!profileData.value?.profile?.user?.registrationDate) {
    return 'Unknown'
  }
  return dateFromNow(profileData.value?.profile?.user?.registrationDate)
})

const levels = computed<LevelInfoFragment[]>(() => {
  return (profileData.value?.profile?.user?.levels ?? []) as LevelInfoFragment[]
})

const featuredLevels = computed<LevelInfoFragment[]>(() => {
  return (profileData.value?.profile?.user?.featuredLevels ?? []) as Array<LevelInfoFragment>
})

const collections = computed(() => {
  return profileData.value?.profile?.user?.collections
})

function commaSeparated(n: number) {
  if (n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return '0'
}

function getTotalPlayTimeText(time: number) {
  const hours = Math.floor(time / 36000)
  const minutes = Math.floor((time % 36000) / 600)
  const seconds = Math.floor((time % 600) / 10)
  return `${hours}:${minutes}:${seconds}`
}

defineCytoidPage({
  title: profileData.value?.profile?.user?.name ?? profileId,
  background: profileData.value?.profile?.header?.original ?? undefined,
}, (() => {
  const meta = new Meta(
    profileData.value?.profile?.user?.name ?? profileData.value?.profile?.user?.uid ?? 'Profile',
    profileData.value?.profile?.bio ?? 'There is no bio yet.',
  )
  meta.extend('author', profileData.value?.profile?.user?.name ?? profileData.value?.profile?.user?.uid ?? 'Profile')
  meta.extend('og:image', profileData.value?.profile?.header?.original)

  return meta
})())
</script>

<template>
  <LayoutContent v-if="profileData?.profile && !hiddenProfile">
    <template #contentTitle>
      <div class="flex w-full m-4">
        <div class="avatar">
          <div class="w-24 h-24 mt-4 rounded-full">
            <img v-if="profileData.profile.user?.avatar.large" :src="profileData.profile.user?.avatar.large">
          </div>
        </div>
        <div class="flex flex-col justify-center gap-1 flex-1 pt-6 px-4 w-0">
          <div>
            <p class="card-title break-all">
              {{ profileData.profile.user?.name || profileData.profile.user?.uid }}
            </p>
          </div>
          <div v-if="profileData.profile.rating" class="flex gap-2">
            <div
              class="tooltip tooltip-bottom flex items-center"
              :data-tip="`${profileData.profile.exp.totalExp - profileData.profile.exp.currentLevelExp} / ${profileData.profile.exp.nextLevelExp - profileData.profile.exp.currentLevelExp}`"
            >
              <div class="badge badge-primary">
                Lv. {{ profileData.profile.exp.currentLevel }}
              </div>
            </div>
            <UserRatingBadge :rating="profileData.profile.rating" />
          </div>
          <div class="flex gap-2 my-1">
            <span
              class="badge badge-sm"
              :class="{
                'badge-success': online,
                'bg-gray-500': !online,
              }"
            />
            <span class="text-sm">
              {{ $t('profile.last_seen_date', { date: lastSeen }) }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #subContent>
      <!-- Bio -->
      <div v-if="profileData.profile.bio" class="card w-full bg-base-100 shadow-xl mb-5">
        <div class="card-body">
          <h2 class="card-subtitle">
            {{ $t('profile.bio_title') }}
          </h2>
          <div class="prose prose-sm" v-html="useMarked(profileData.profile.bio)" />
          <div class="mt-4 flex gap-2 opacity-50">
            <Icon name="mdi:calendar-account" size="20" />
            <span class="text-sm">
              {{ $t('profile.join_date', { date: registrationDate }) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Badges -->
      <div v-if="faBadges.length + eventBadges.length > 0" class="card w-full bg-base-100 shadow-xl mb-5">
        <div class="card-body">
          <template v-if="eventBadges.length > 0">
            <h2 class="card-subtitle">
              {{ $t('profile.badges_title') }}
            </h2>
            <div class="grid grid-cols-3 gap-2 mb-2">
              <img v-for="badge in eventBadges" :key="badge.uid" :src="badge.metadata.imageUrl" :alt="badge.description ?? undefined" class="rounded-md">
            </div>
          </template>
          <template v-if="faBadges.length > 0">
            <div v-for="badge in faBadges" :key="badge.uid" class="collapse collapse-open my-2">
              <div class="collapse-title min-h-0 py-0 px-2 flex items-center text-xl font-medium">
                <FAIcon :package="badge.metadata.fontawesome.pack" :icon="badge.metadata.fontawesome.icon" :class="`h-6 w-6 inline-block mr-2 ${badge.metadata.fontawesome.class}`" />
                {{ badge.title }}
              </div>
              <div
                class="collapse-content p-0" style="padding-bottom: 0"
              >
                <p class="pt-2 px-2">
                  {{ badge.description }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Recent plays -->
      <div v-if="profileData.profile.recentRecords.length > 0" class="card w-full bg-base-100 shadow-xl mb-5">
        <div class="card-body">
          <h2 class="card-subtitle">
            {{ $t('profile.recent_ranks_title') }}
          </h2>
          <RecordCard v-for="record in profileData.profile.recentRecords" :key="record.id" :record="record" />
        </div>
      </div>
    </template>

    <!-- Gameplay -->
    <div class="card overflow-hidden bg-base-100 w-full shadow-xl mb-5">
      <div class="card-body bg-primary/25">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <defineStatItem v-slot="{ title, data }">
            <div class="stat p-0">
              <div class="stat-title text-neutral-content">
                {{ title }}
              </div>
              <div class="stat-value text-xl">
                {{ data }}
              </div>
            </div>
          </defineStatItem>
          <StatItem :title="$t('profile.total_ranked_plays')" :data="profileData.profile.activity.totalRankedPlays" />
          <StatItem :title="$t('profile.total_cleared_notes')" :data="commaSeparated(profileData.profile.activity.clearedNotes)" />
          <StatItem :title="$t('profile.highest_max_combo')" :data="commaSeparated(profileData.profile.activity.maxCombo)" />
          <StatItem :title="$t('profile.avg_ranked_accuracy')" :data="`${(profileData.profile.activity.averageRankedAccuracy * 100).toFixed(2)}%`" />
          <StatItem :title="$t('profile.total_ranked_score')" :data="commaSeparated(profileData.profile.activity.totalRankedScore)" />
          <StatItem :title="$t('profile.total_play_time')" :data="getTotalPlayTimeText(profileData.profile.activity.totalPlayTime)" />
        </div>

        <div class="overflow-auto w-auto">
          <div
            class="tabs rounded-full w-max bg-neutral mt-2"
          >
            <a
              class="tab rounded-full"
              :class="{
                'tab-active bg-primary-focus text-primary-content': selectChart === 'rating',
              }"
              @click="selectChart = 'rating'"
            >{{ $t('profile.chart_radio_rating') }}</a>
            <a
              class="tab rounded-full"
              :class="{
                'tab-active bg-primary-focus text-primary-content': selectChart === 'activity',
              }"
              @click="selectChart = 'activity'"
            >{{ $t('profile.chart_radio_ranked_plays') }}</a>
            <a
              class="tab rounded-full"
              :class="{
                'tab-active bg-primary-focus text-primary-content': selectChart === 'accuracy',
              }"
              @click="selectChart = 'accuracy'"
            >{{ $t('profile.avg_ranked_accuracy') }}</a>
          </div>
        </div>
        <ProfileLineChart :data="profileData.profile.timeseries" :mode="selectChart" />
      </div>
    </div>

    <!-- Collection -->
    <div
      v-if="collections && collections.length > 0"
      class="card bg-base-100 overflow-hidden w-full shadow-xl mb-5"
    >
      <div class="card-body bg-secondary/25">
        <h2 class="card-subtitle">
          {{ $t('profile.collections_title') }}
        </h2>
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <CollectionCard
            v-for="collection in collections" :key="collection.id"
            :collection="collection"
            class="h-48"
          />
        </div>
        <NuxtLink :to="{ name: 'collections', query: { owner: profileData.profile.user?.id } }" class="btn btn-secondary mt-4">
          {{ $t('profile.collections_all_btn', { count: profileData.profile.user?.collectionsCount }) }}
        </NuxtLink>
      </div>
    </div>

    <!-- Levels -->
    <div
      v-if="profileData.profile.user?.levelsCount ?? 0 > 0"
      class="card w-full bg-base-100 shadow-xl overflow-hidden mb-5"
    >
      <div
        v-if="profileData.profile.user?.featuredLevelsCount !== 0"
        class="card-body card bg-featured/25"
      >
        <h2 class="card-subtitle">
          {{ $t('profile.levels_title') }}
        </h2>
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <LevelCard
            v-for="level, index in featuredLevels" :key="index"
            class="h-48"
            :trim="true"
            :level="{
              uid: level.uid,
              metadata: {
                title: level.title,
                title_localized: level.metadata.title_localized ?? undefined,
                artist: {
                  name: level.metadata.artist?.name ?? undefined,
                },
              },
              musicPreview: level.bundle?.musicPreview ?? undefined,
              cover: level.bundle?.backgroundImage?.thumbnail ?? '',
              charts: level.charts.map(chart => ({
                ...chart,
                name: chart.name ?? undefined,
              })),
            }"
          />
        </div>
        <NuxtLink :to="{ name: 'levels', query: { owner: profileData.profile.user?.uid || profileData.profile.user?.id, featured: 'true' } }" class="btn bg-featured mt-4">
          {{ $t('profile.levels_featured_all_btn', { count: profileData.profile.user?.featuredLevelsCount }) }}
        </NuxtLink>
      </div>
      <!-- TODO: waiting qualified system -->
      <!-- <div
        v-if="profileData.profile.user?.featuredLevelsCount !== 0"
        class="card-body card bg-qualified/25"
        :class="{
          'rounded-t-none': true || true,
        }"
      >
      </div> -->
      <div class="card-body">
        <h2 v-if="profileData.profile.user?.featuredLevelsCount === 0" class="card-subtitle">
          {{ $t('profile.levels_title') }}
        </h2>
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          <LevelCard
            v-for="level, index in levels" :key="index"
            class="h-48"
            :trim="true"
            :level="{
              uid: level.uid,
              metadata: {
                title: level.title,
                title_localized: level.metadata.title_localized ?? undefined,
                artist: {
                  name: level.metadata.artist?.name ?? undefined,
                },
              },
              musicPreview: level.bundle?.musicPreview ?? undefined,
              cover: level.bundle?.backgroundImage?.thumbnail ?? '',
              charts: level.charts.map(chart => ({
                ...chart,
                name: chart.name ?? undefined,
              })),
            }"
          />
        </div>
        <NuxtLink :to="{ name: 'levels', query: { owner: profileData.profile.user?.uid || profileData.profile.user?.id } }" class="btn btn-neutral mt-4">
          {{ $t('profile.levels_all_btn', { count: profileData.profile.user?.levelsCount }) }}
        </NuxtLink>
      </div>
    </div>

    <!-- Comments -->
    <CommentThread
      v-if="profileData.profile.user?.id"
      category="profile"
      :thread="profileData.profile.user?.id"
    />
  </LayoutContent>

  <!-- Admin -->
  <div class="w-full flex">
    <button
      v-if="(
        user?.role === 'admin'
        || user?.role === 'moderator'
      ) && hiddenProfile === true"
      class="btn btn-ghost flex-1" @click="hiddenProfile = false"
    >
      Show Hidden Profile (ADMIN)
    </button>
  </div>
</template>
