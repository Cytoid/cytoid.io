<script setup lang="ts">
const props = defineProps<{
  levelId: string
  charts: chartData[]
}>()

const rankingQuery = gql(/* GraphQL */`
  query FetchLevelRanking($levelUid: String!, $type: String!, $start: Int!) {
    chart(levelUid: $levelUid, chartType: $type) {
      id
      numPlayers
      leaderboard(limit: 10, start: $start) {
        id
        date
        owner {
          id
          uid
          name
          avatar {
            small
          }
        }
        score
        accuracy
        mods
        details {
          perfect
          great
          good
          bad
          miss
          maxCombo
        }
      }
    }
  }
`)

// fetch Ranking
const selectedDiffRank = ref((() => {
  return props.charts[0].type
})())
const diffRankPage = ref(1)
const realDiffRankPage = ref(1)
const loadingRank = ref(true)

const rankData = ref(await (async () => await syncRanking())())

watch(selectedDiffRank, async () => {
  const newRanking = await syncRanking()
  rankData.value = newRanking
})
watch(diffRankPage, async (val) => {
  const newRanking = await syncRanking()
  rankData.value = newRanking
  realDiffRankPage.value = val
})
function setRankPage(val: number) {
  diffRankPage.value = val
}
async function syncRanking() {
  loadingRank.value = true
  const ans = await useQuery(rankingQuery, {
    levelUid: props.levelId,
    type: selectedDiffRank.value ?? 'easy',
    start: (diffRankPage.value - 1) * 10,
  })
  loadingRank.value = false
  return ans
}

interface chartData {
  difficulty: number
  type: string
  name?: string
  notesCount: number
}
</script>

<template>
  <div class="card w-full bg-base-100 mb-5">
    <div v-if="rankData" class="px-4 py-8 sm:px-8">
      <!-- Difficult Selector -->
      <p class="card-subtitle">
        {{ $t('level_details.difficulty_card_title') }}
      </p>
      <div
        class="tabs rounded-full w-fit bg-neutral/25 mt-2"
      >
        <a
          v-if="charts.some(c => c.type === 'extreme')"
          class="tab rounded-full order-1"
          :class="{
            'tab-active diff-badge-extreme': selectedDiffRank === 'extreme',
          }"
          @click="selectedDiffRank = 'extreme'"
        >Extreme</a>
        <a
          v-if="charts.some(c => c.type === 'hard')"
          class="tab rounded-full order-2"
          :class="{
            'tab-active diff-badge-hard': selectedDiffRank === 'hard',
          }"
          @click="selectedDiffRank = 'hard'"
        >Hard</a>
        <a
          v-if="charts.some(c => c.type === 'easy')"
          class="tab rounded-full order-3"
          :class="{
            'tab-active diff-badge-easy': selectedDiffRank === 'easy',
          }"
          @click="selectedDiffRank = 'easy'"
        >Easy</a>
      </div>

      <!-- loading bar -->
      <progress
        class="progress progress-primary"
        :class="{
          'opacity-0': !loadingRank,
        }"
      />
      <!-- Rank -->
      <div
        v-if="rankData.chart"
        class="overflow-x-auto rounded-lg"
        :class="{
          'opacity-50': loadingRank,
        }"
      >
        <table class="table w-full">
          <thead class="bg-neutral text-neutral-content">
            <tr class="border-b-0">
              <th />
              <th>Player</th>
              <th>Score</th>
              <th>Acc</th>
              <th>Combo</th>
              <th>Details</th>
              <th>Mods</th>
              <th>Achieved</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(rank, index) in rankData.chart.leaderboard" :key="index + realDiffRankPage * 10 - 9"
              class="even:bg-neutral-focus border-b-0"
            >
              <th>#{{ index + realDiffRankPage * 10 - 9 }}</th>
              <td class="text-sm">
                <div class="flex">
                  <UserAvatar
                    :avatar="rank.owner?.avatar.small ?? undefined"
                    :name="(rank.owner?.name || rank.owner?.uid) ?? 'Unknown User'"
                    :uid="rank.owner?.uid ?? undefined"
                    :transparent="true"
                  />
                </div>
              </td>
              <td class="font-semibold">
                <div class="flex gap-x-1 items-center">
                  <RecordScoreBadge :score="rank.score" />
                  {{ rank.score }}
                </div>
              </td>
              <td class="font-semibold">
                {{ (Math.floor(rank.accuracy * 10000) / 100).toFixed(2) }}%
              </td>
              <td class="font-semibold">
                {{ rank.details.maxCombo }}x
              </td>
              <td>
                <div class="flex gap-x-1">
                  <span class="text-blue-400">{{ rank.details.perfect }} </span> /
                  <span class="text-yellow-400">{{ rank.details.great }} </span> /
                  <span class="text-green-400">{{ rank.details.good }} </span> /
                  <span class="text-red-400">{{ rank.details.bad }} </span> /
                  <span>{{ rank.details.miss }}</span>
                </div>
              </td>
              <td>
                <div class="flex">
                  <span v-for="mod in rank.mods" :key="mod">
                    <Mod :mod="mod" />
                  </span>
                </div>
              </td>
              <td>
                <div class="whitespace-nowrap">
                  {{ dateFromNow(rank.date) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="rankData.chart.leaderboard.length === 0" class="bg-base-200 w-full">
          <p class="m-auto p-10 w-fit opacity-60 select-none">
            No record yet.
          </p>
        </div>
      </div>

      <!-- Page Switch -->
      <Pagination
        v-if="rankData.chart?.numPlayers && rankData.chart?.numPlayers > 10"
        class="w-full justify-center sm:justify-end"
        :page="diffRankPage"
        :total-page="Math.ceil(rankData.chart?.numPlayers / 10)"
        :to-first-page="() => { diffRankPage = 1 }"
        :to-prev-page="() => { diffRankPage -= 1 }"
        :to-next-page="() => { diffRankPage += 1 }"
        :to-final-page="() => { if (rankData?.chart) { diffRankPage = Math.ceil(rankData.chart.numPlayers / 10) } }"
        :jump-to-page="setRankPage"
      />
    </div>
    <div v-else>
      <p class="card-subtitle">
        Loading...
      </p>
    </div>
  </div>
</template>
