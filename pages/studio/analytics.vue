<script setup lang="ts">
import type { StudioAnalyticsQuery } from '~/gql/graphql'

const { user } = useAuth()

const query = gql(/* GraphQL */`
  query StudioAnalytics($uid: String!) {
    profile(uid: $uid) {
      id
      user {
        id
        uid
        name
        avatar {
          large
        }
      }
      rating
      recentRecords(limit: 30) {
        ...RecordFragmentForStudioAnalytics
      }
      bestRecords(limit: 30) {
        ...RecordFragmentForStudioAnalytics
      }
    }
  }
  fragment RecordFragmentForStudioAnalytics on UserRecord {
    id
    date
    chart {
      id
      type
      name
      notesCount
      difficulty
      level {
        uid
        title
        bundle {
          backgroundImage {
            sized(height: 90, width: 160)
          }
        }
      }
    }
    accuracy
    rating
  }
`)

const selected = ref<'recent' | 'best'>('best')
const userUid = ref<string>('')

const data = ref<StudioAnalyticsQuery | null>(null)

const profile = computed(() => {
  if (data.value?.profile?.user?.uid === userUid.value) {
    return data.value.profile
  }
  return undefined
})

const recentRecords = ref<Record[]>([])
const bestRecords = ref<Record[]>([])

const allRecords = computed(() => {
  if (selected.value === 'best') {
    return bestRecords.value
  }
  else {
    return recentRecords.value
  }
})
const avgRating = computed(() => {
  return allRecords.value.reduce((acc, cur) => acc + cur.rating, 0) / allRecords.value.length
})

const page = ref(1)
const pageCount = computed(() => {
  return Math.ceil(allRecords.value.length / 10)
})
const records = computed(() => {
  const start = (page.value - 1) * 10
  const end = Math.min(start + 10, allRecords.value.length)
  return allRecords.value.slice(start, end)
})

watch(userUid, async (uid) => {
  if (!uid) {
    return
  }
  const ans = await useQuery(query, { uid })
  if (ans?.profile) {
    data.value = ans
    recentRecords.value = ans.profile.recentRecords
    bestRecords.value = ans.profile.bestRecords
  }
})

onMounted(() => {
  if (user.value) {
    userUid.value = user.value.uid
  }
  else {
    watchOnce(user, (userData) => {
      if (userData) {
        userUid.value = userData.uid
      }
    })
  }
})

interface Record {
  id: number
  date: string
  chart?: Maybe<{
    id: number
    type: string
    name?: Maybe<string>
    difficulty: number
    notesCount: number
    level?: Maybe<{
      uid: string
      title: string
      bundle?: Maybe<{
        backgroundImage?: Maybe<{
          sized?: Maybe<string>
        }>
      }>
    }>
  }>
  accuracy: number
  rating: number
}
</script>

<template>
  <div v-if="user" class="w-full flex flex-col gap-5">
    <div v-if="userUid" class="card overflow-hidden bg-base-100 w-full shadow-xl">
      <div class="card-body gap-2">
        <h2 v-if="profile" class="card-subtitle">
          User Rating
        </h2>
        <div v-if="profile" class="flex w-full m-4">
          <div class="avatar">
            <div class="w-16 h-16 rounded-full">
              <img v-if="profile.user?.avatar.large" :src="profile.user?.avatar.large">
            </div>
          </div>
          <div class="flex flex-col justify-center gap-1 flex-1 px-4 w-0">
            <div>
              <p class="card-title break-all">
                {{ profile.user?.name || profile.user?.uid }}
              </p>
            </div>
            <div v-if="profile.rating" class="flex gap-2">
              <UserRatingBadge :rating="profile.rating" />
            </div>
          </div>
        </div>

        <h2 class="card-subtitle">
          Rating Analytics
        </h2>
        <div class="flex flex-col sm:flex-row sm:gap-4 sm:justify-between sm:items-center">
          <div
            class="tabs rounded-full w-max bg-neutral mt-2"
          >
            <a
              class="tab rounded-full"
              :class="{
                'tab-active bg-primary-focus text-primary-content': selected === 'best',
              }"
              @click="selected = 'best'"
            > Best Records </a>
            <a
              class="tab rounded-full"
              :class="{
                'tab-active bg-primary-focus text-primary-content': selected === 'recent',
              }"
              @click="selected = 'recent'"
            > Recent Records </a>
          </div>
          <div class="flex justify-end">
            Average: {{ truncateNum(avgRating) }}
          </div>
        </div>

        <div v-if="allRecords.length > 0" class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Chart</th>
                <th>Acc</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record, index in records" :key="index">
                <td class="flex items-center space-x-3">
                  <div class="flex gap-4">
                    <div
                      class="aspect-video h-12 sm:h-20 bg-cover rounded-lg"
                      :style="`background-image: url(&quot;${record.chart?.level?.bundle?.backgroundImage?.sized}&quot;)`"
                    >
                      <NuxtLink
                        :to="{ name: 'levels-id', params: { id: record.chart?.level?.uid } }"
                        class="block w-full h-full opacity-0 hover:opacity-25 transition-opacity duration-200 bg-base-200"
                      />
                    </div>
                    <div class="max-w-[16rem] flex flex-col justify-center">
                      <div class="font-bold truncate">
                        {{ record.chart?.level?.title }}
                      </div>
                      <div class="text-sm opacity-50 truncate">
                        {{ record.chart?.level?.uid }}
                      </div>
                      <div class="flex flex-warp mt-2">
                        <LevelDiffBadgeSmall
                          v-if="record.chart"
                          :type="record.chart.type"
                          :name="record.chart.name ?? record.chart.type"
                          :difficulty="record.chart.difficulty"
                          :notes-count="record.chart.notesCount"
                          class="badge-md w-auto max-w-full"
                        />
                      </div>
                    </div>
                  </div>
                </td>
                <td>{{ truncateNum(record.accuracy * 100) }}%</td>
                <td>{{ truncateNum(record.rating) }}</td>
                <td>{{ dateFormatCalendar(record.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="alert alert-info">
          <Icon name="mdi:loading" size="24" class="animate-spin" />
          <span>Loading...</span>
        </div>

        <Pagination
          v-if="records && pageCount > 1"
          class="w-full justify-center sm:justify-end"
          :page="page"
          :total-page="pageCount"
          :to-first-page="() => { page = 1 }"
          :to-prev-page="() => { page -= 1 }"
          :to-next-page="() => { page += 1 }"
          :to-final-page="() => { page = pageCount }"
          :jump-to-page="(i) => { page = i }"
        />
      </div>
    </div>
  </div>
  <div v-else class="alert alert-info">
    <Icon name="mdi:loading" size="24" class="animate-spin" />
    <span>Loading...</span>
  </div>
</template>
