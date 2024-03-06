<script setup lang="ts">
const route = useRoute()
// get route.params.id then decode as number
const recordId = Number.parseInt(route.params.id.toString())
const chartId = Number.parseInt(route.params.chartId.toString())

const query = gql(`
  query FetchRecord($id: Int!, $chartId: Int!) {
    record (id: $id, chartId: $chartId) {
      id
      date
      owner {
        id
        uid
        name
        avatar {
          large
        }
      }
      details{
        perfect
        great
        good
        bad
        miss
        maxCombo
      }
      chart {
        id
        type
        name
        notesCount
        difficulty
        level {
          id
          uid
          title
          category
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
            musicPreview
          }
        }
      }
      mods
      accuracy
      score
      ranked
      rating
      recentRating
    }
  }
`)

const { data, error } = await useAsyncQuery(query, {
  id: recordId,
  chartId,
})
if (recordId && !data.value?.record) {
  showError(error.value?.message ?? createError({
    statusCode: 404,
    statusMessage: 'Record not found',
  }))
}
else {
  useSWR()
}

const scoreTextColor = computed(() => {
  if (data.value?.record?.score === 1000000) {
    return 'grade-max-text-gradient'
  }
  if ((data.value?.record?.score ?? 0) > 999000) {
    return 'grade-sss-text-gradient'
  }
})

defineCytoidPage({
  title: `Record ${data.value?.record?.chart?.level?.title}`,
}, {
  image: data.value?.record?.chart?.level?.bundle?.backgroundImage?.thumbnail ?? undefined,
  unsafeDescription: [
    `Player: ${data.value?.record?.owner?.name ?? data.value?.record?.owner?.uid}`,
    `Score: ${data.value?.record?.score}`,
    `MAX Combo: ${data.value?.record?.details.maxCombo}`,
    `Accuracy: ${truncateNum((data.value?.record?.accuracy ?? 0) * 100)}%`,
    ...(
      data.value?.record?.ranked
        ? [`Rating: ${truncateNum(data.value?.record?.rating ?? 0)}`]
        : ['Practice']
    ),
  ].join(' | '),
  cardType: 'summary',
})
</script>

<template>
  <div v-if="data?.record" class="max-w-5xl mx-auto">
    <div class="h-24 relative">
      <div id="contentTitle" class="absolute bottom-0 left-0">
        <h1 class="text-4xl font-bold">
          Record
        </h1>
      </div>
    </div>
    <div class="card bg-base-100 mt-4">
      <div class="card-body">
        <div class="grid items-center grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 sm:grid-flow-dense">
          <LevelCard
            v-if="data.record.chart?.level"
            class="h-48 sm:h-full sm:col-span-7"
            :level="{
              ...data.record.chart.level,
              charts: [
                data.record.chart,
              ],
            }"
          >
            <template #top>
              <div class="flex gap-1">
                <span v-for="mod in data.record.mods" :key="mod">
                  <Mod :mod="mod" :size="32" />
                </span>
              </div>
            </template>
          </LevelCard>
          <div class="sm:col-span-5 flex flex-col gap-2">
            <!-- Owner -->
            <div
              v-if="data.record.owner"
              class="flex w-full"
            >
              <NuxtLink
                :to="{ name: 'profile-id', params: { id: data.record.owner.uid ?? data.record.owner.id } }"
                class="avatar"
              >
                <div class="w-16 h-16 rounded-full">
                  <img v-if="data.record.owner.avatar.large" :src="data.record.owner.avatar.large">
                </div>
              </NuxtLink>
              <div class="flex flex-col justify-center gap-1 flex-1 px-4 w-0">
                <NuxtLink
                  :to="{ name: 'profile-id', params: { id: data.record.owner.uid ?? data.record.owner.id } }"
                  class="w-fit"
                >
                  <p class="card-title break-all">
                    {{ data.record.owner?.name || data.record.owner.uid }}
                  </p>
                </NuxtLink>
                <div class="flex flex-wrap gap-x-1">
                  <span class="flex flex-nowrap">
                    {{ dateFormatCalendar(data.record.date) }},
                  </span>
                  <span class="flex flex-nowrap">
                    {{ dateFromNow(data.record.date) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Detail -->
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-2">
                <!-- Score -->
                <p
                  class="text-6xl lg:text-7xl xl:text-8xl font-light w-fit"
                  :class="scoreTextColor"
                >
                  {{ data.record.score }}
                </p>
                <div class="flex flex-wrap-reverse gap-x-4 gap-y-1 items-center">
                  <!-- Acc -->
                  <span class="flex flex-nowrap">
                    <template v-if="data.record.accuracy === 1">
                      Full accuracy
                    </template>
                    <template v-else>
                      {{ truncateNum(data.record.accuracy * 100) }}% accuracy
                    </template>
                  </span>
                  <!-- Combo -->
                  <span class="flex flex-nowrap">
                    <template v-if="data.record.details.maxCombo === data.record.chart?.notesCount">
                      Full combo
                    </template>
                    <template v-else>
                      {{ data.record.details.maxCombo }} max combo
                    </template>
                  </span>
                  <!-- Rating -->
                  <div
                    v-if="data.record.ranked"
                    class="tooltip tooltip-primary"
                    :data-tip="`recent: ${truncateNum(data.record.recentRating ?? 0)}`"
                  >
                    <div class="badge badge-neutral flex-nowrap">
                      Rating {{ truncateNum(data.record.rating) }}
                    </div>
                  </div>
                  <div v-else class="badge badge-secondary">
                    Practice
                  </div>
                </div>
              </div>
              <!-- Detail -->
              <div class="flex flex-wrap gap-x-4">
                <div class="text-blue-400 flex gap-1 flex-nowarp">
                  <span class="text-blue-100">
                    Perfect
                  </span>
                  {{ data.record.details.perfect }}
                </div>
                <div class="text-yellow-400 flex gap-1 flex-nowarp">
                  <span class="text-yellow-100">
                    Great
                  </span>
                  {{ data.record.details.great }}
                </div>
                <div class="text-green-400 flex gap-1 flex-nowarp">
                  <span class="text-green-100">
                    Good
                  </span>
                  {{ data.record.details.good }}
                </div>
                <div class="text-red-400 flex gap-1 flex-nowarp">
                  <span class="text-red-100">
                    Bad
                  </span>
                  {{ data.record.details.bad }}
                </div>
                <div class="text-slate-400 flex gap-1 flex-nowarp">
                  <span class="text-slate-100">
                    Miss
                  </span>
                  {{ data.record.details.miss }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
