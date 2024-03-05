<script setup lang="ts">
import type { FetchRecordsQuery } from '#build/urql-client/codegen/default/graphql'
import { QueryOrder, RecordQuerySort } from '#build/urql-client/codegen/default/graphql'

definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const router = useRouter()
const { user, isModerator } = useAuth()

const query = gql(`
  query FetchRecords (
    $query: RecordQueryInput,
    $page: Int,
    $limit: Int,
    $sort: RecordQuerySort,
    $order: QueryOrder
  ) {
    records(
      query: $query,
      page: $page,
      limit: $limit,
      sort: $sort,
      order: $order
    ) {
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
      details {
        perfect
        great
        good
        bad
        miss
        maxCombo
      }
      score
      accuracy
      ranked
      rating
      recentRating
    }
  }
`)
const queryCount = gql(`
  query FetchRecordsCount (
    $query: RecordQueryInput
  ) {
    recordsCount(query: $query)
  }
`)

const records = ref<FetchRecordsQuery['records']>([])
const totalRecordsCount = ref(0)
const page = computed({
  get: () => Number.parseInt(route.query.page?.toString() ?? '1'),
  set: (value) => {
    router.push({
      query: {
        ...route.query,
        page: value,
      },
    })
  },
})

const limit = 10

const loading = ref(true)
const pageCount = computed(() => Math.ceil(totalRecordsCount.value / limit))

const syncData = useDebounceFn(async (recount: boolean = true) => {
  loading.value = true

  await until(user).toMatch(u => !!u)
  const ownerQuery = route.query.owner as string
  const allowOwner = ['admin', 'moderator'].includes(user.value!.role)
  const owner = !allowOwner
    ? user.value!.id
    : ownerQuery === '_'
      ? undefined
      : (ownerQuery ?? user.value!.id)
  const chartId = Number.parseInt(route.query.chartId as string) || undefined
  const best = (route.query.best as string) === 'true'
  const ranked = isModerator && (route.query.ranked as string) !== 'false'

  const sort = route.query.sort?.toString() || 'date'
  const order = route.query.order?.toString() || 'desc'

  const startDate = sort === 'recent_rating'
    ? new Date(Math.max(
      Date.now() - 1000 * 60 * 60 * 24 * 7,
      new Date(route.query.start_date?.toString() ?? 0).getTime(),
    )).toISOString().split('T')[0]
    : route.query.start_date?.toString()
  const endDate = sort === 'recent_rating'
    ? new Date(Math.max(
      (new Date(startDate!)).getTime(),
      new Date(route.query.end_date?.toString() ?? Date.now()).getTime(),
    )).toISOString().split('T')[0]
    : route.query.end_date?.toString()

  const page = Number.parseInt(route.query.page?.toString() ?? '1') - 1

  if (recount) {
    const countData = await useQuery(queryCount, {
      query: {
        ...(
          owner
            ? isUUID(owner)
              ? { ownerId: owner }
              : { ownerUid: owner }
            : {}
        ),
        chartId,
        startDate,
        endDate,
        best,
        ranked,
      },
    })
    totalRecordsCount.value = countData?.recordsCount ?? 0
  }

  const data = await useQuery(query, {
    query: {
      ...(
        owner
          ? isUUID(owner)
            ? { ownerId: owner }
            : { ownerUid: owner }
          : {}
      ),
      chartId,
      startDate,
      endDate,
      best,
      ranked,
    },
    page,
    limit,
    sort: {
      date: RecordQuerySort.Date,
      rating: RecordQuerySort.Rating,
      score: RecordQuerySort.Score,
      accuracy: RecordQuerySort.Accuracy,
      recent_rating: RecordQuerySort.RecentRating,
    }[sort] ?? RecordQuerySort.Date,
    order: {
      asc: QueryOrder.Asc,
      desc: QueryOrder.Desc,
    }[order] ?? QueryOrder.Desc,
  })
  records.value = data?.records ?? []

  loading.value = false

  return data?.records ?? []
}, 1000)

watch(
  () => route.query,
  async (newVal, oldVal) => {
    // if only pages changed, don't recount
    const isNeedRecount = Object.keys(newVal).some(key => key !== 'page' && newVal[key] !== oldVal[key])
    await syncData(isNeedRecount)
    if (window) {
      window.scroll(0, 0)
    }
  },
)

onMounted(() => {
  nextTick(() => {
    syncData()
  })
})

defineCytoidPage({
  title: 'Records',
})
</script>

<template>
  <div class="max-w-5xl mx-auto flex flex-col gap-4">
    <div class="h-24 relative">
      <div id="contentTitle" class="absolute bottom-0 left-0">
        <h1 class="text-4xl font-bold">
          Records
        </h1>
      </div>
    </div>

    <SearchBarRecord />
    <progress v-if="loading && records.length > 0" class="progress progress-info w-full" />

    <div class="card bg-base-100">
      <div class="card-body">
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Record</th>
                <th>Detail</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record, index in records" :key="index">
                <td class="flex items-center space-x-3">
                  <RecordCard
                    class="w-80"
                    :record="{
                      ...record,
                      owner: (record.owner?.uid && record.owner.avatar.small) ? {
                        uid: record.owner.uid,
                        name: record.owner.name ?? record.owner.uid,
                        avatar: {
                          small: record.owner.avatar.small,
                        },
                      } : undefined,
                    }"
                  />
                </td>
                <td>
                  <p
                    class="text-4xl font-light w-fit"
                    :class="{
                      'grade-max-text-gradient': record.score === 1000000,
                      'grade-sss-text-gradient': record.score < 1000000 && record.details.maxCombo === record.chart?.notesCount,
                    }"
                  >
                    {{ record.score }}
                  </p>
                  <div class="flex flex-wrap-reverse gap-x-4 gap-y-1 items-center">
                    <!-- Acc -->
                    <span class="flex flex-nowrap">
                      <template v-if="record.accuracy === 1">
                        Full accuracy
                      </template>
                      <template v-else>
                        {{ truncateNum(record.accuracy * 100) }}% accuracy
                      </template>
                    </span>
                    <!-- Combo -->
                    <span class="flex flex-nowrap">
                      <template v-if="record.details.maxCombo === record.chart?.notesCount">
                        Full combo
                      </template>
                      <template v-else>
                        {{ record.details.maxCombo }} max combo
                      </template>
                    </span>
                  </div>

                  <!-- Detail -->
                  <div class="flex flex-nowarp gap-x-2">
                    <span class="text-blue-400">
                      {{ record.details.perfect }}
                    </span> /
                    <span class="text-yellow-400">
                      {{ record.details.great }}
                    </span> /
                    <span class="text-green-400">
                      {{ record.details.good }}
                    </span> /
                    <span class="text-red-400">
                      {{ record.details.bad }}
                    </span> /
                    <span class="text-slate-400">
                      {{ record.details.miss }}
                    </span>
                  </div>
                </td>
                <td>
                  <template v-if="record.ranked">
                    <span>
                      {{ truncateNum(record.rating) }}
                    </span>
                    <span class="opacity-75">
                      ({{ truncateNum(record.recentRating ?? 0) }})
                    </span>
                  </template>
                  <span v-else class="opacity-75 select-none">
                    Practice
                  </span>
                </td>
                <td>{{ dateFormatCalendar(record.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <progress v-if="loading" class="progress progress-info w-full" />

        <Pagination
          v-if="records && pageCount > 1"
          v-model="page" :total="pageCount"
          class="w-full justify-center sm:justify-end"
        />
      </div>
    </div>
  </div>
</template>
