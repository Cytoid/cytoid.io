<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router'
import { RecordQuerySort } from '#build/urql-client/codegen/default/graphql'

const route = useRoute()
const router = useRouter()

const { user, isModerator } = useAuth()

const chartId = computed({
  get() {
    return route.query.chartId?.toString()
  },
  set(newVal) {
    updateRouter({ chartId: newVal || undefined })
  },
})
const _chartId = ref<string | undefined>(chartId.value)

const ownerIdOrUid = computed({
  get() {
    return route.query.owner?.toString()
  },
  set(newVal) {
    updateRouter({ owner: newVal || undefined })
  },
})
const _ownerIdOrUid = ref<string | null | undefined>(ownerIdOrUid.value)

const startDate = computed({
  get() {
    return route.query.start_date?.toString()
  },
  set(newVal) {
    updateRouter({ start_date: newVal || undefined })
  },
})

const endDate = computed({
  get() {
    return route.query.end_date?.toString()
  },
  set(newVal) {
    updateRouter({ end_date: newVal || undefined })
  },
})

const best = computed({
  get() {
    return route.query.best === 'true'
  },
  set(newVal) {
    updateRouter({ best: newVal ? 'true' : undefined })
  },
})

const ranked = computed({
  get() {
    if (best.value || !isModerator.value) {
      return true
    }
    // unless it is explicitly set to false
    return route.query.ranked !== 'false'
  },
  set(newVal) {
    console.log(newVal)
    updateRouter({ ranked: newVal.toString() || undefined })
  },
})

const order = computed({
  get() {
    return route.query.order || 'desc'
  },
  set(newVal) {
    updateRouter({ order: newVal || undefined })
  },
})

const sortMap: { [key: string]: RecordQuerySort } = {
  date: RecordQuerySort.Date,
  rating: RecordQuerySort.Rating,
  score: RecordQuerySort.Score,
  accuracy: RecordQuerySort.Accuracy,
  recent_rating: RecordQuerySort.RecentRating,
}
const sort = computed<RecordQuerySort>({
  get() {
    return sortMap[route.query.sort as string] ?? RecordQuerySort.Date
  },
  set(newVal) {
    updateRouter({ sort: Object.keys(sortMap).find(key => sortMap[key] === newVal) })
  },
})

function updateInput() {
  updateRouter({
    chartId: _chartId.value,
    owner: _ownerIdOrUid.value ?? undefined,
  })
}

async function updateRouter(val: LocationQueryRaw | undefined) {
  await router.replace({
    query: {
      ...route.query,
      page: undefined,
      ...val,
    },
  })
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body gap-4">
      <!-- Chart -->
      <div class="w-full sm:flex">
        <div class="sm:flex gap-4 w-full">
          <div class="w-full max-w-xl">
            <p class="card-subtitle">
              Chart
            </p>
            <div class="join w-full">
              <input v-model="_chartId" class="join-item input input-bordered w-full max-w-xs" placeholder="Chart ID">
              <button class="join-item btn btn-neutral" @click="_chartId = ''">
                <Icon name="mdi:close" size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Owner -->
      <div v-if="['admin', 'moderator'].includes(user?.role ?? '')" class="w-full sm:flex">
        <div class="sm:flex gap-4 w-full">
          <div class="w-full max-w-xl">
            <p class="card-subtitle">
              Owner
            </p>
            <div v-if="ownerIdOrUid !== '_'" class="join w-full">
              <input v-model="_ownerIdOrUid" class="join-item input input-bordered w-full max-w-xs" placeholder="User ID or UID">
              <button
                class="join-item btn btn-neutral"
                @click="() => {
                  _ownerIdOrUid = ownerIdOrUid
                  ownerIdOrUid = '_'
                }"
              >
                All
              </button>
            </div>
            <button
              v-else
              class="btn btn-secondary"
              @click="() => {
                ownerIdOrUid = _ownerIdOrUid === '_' ? '' : _ownerIdOrUid ?? undefined
              }"
            >
              Search by owner
            </button>
          </div>
        </div>
      </div>

      <div class="w-full flex justify-end">
        <button class="btn btn-primary" @click="updateInput">
          Search
        </button>
      </div>
    </div>
  </div>

  <div class="card bg-base-100 shadow-xl">
    <div class="card-body gap-4">
      <!-- Date -->
      <div class="w-full sm:flex">
        <div class="w-full">
          <p class="card-subtitle">
            Date
          </p>
          <div class="grid sm:grid-cols-2 gap-2 w-full max-w-xl">
            <div class="form-control">
              <div class="join w-full">
                <label for="startDate" class="join-item btn btn-neutral">
                  <Icon name="mdi:calendar-start-outline" size="20" />
                </label>
                <input
                  id="startDate"
                  v-model="startDate"
                  type="date"
                  min="1900-01-01"
                  :max="new Date().toISOString().split('T')[0]"
                  class="input input-bordered join-item w-full"
                  placeholder="Start date"
                >
              </div>
            </div>
            <div class="form-control">
              <div class="join w-full">
                <label for="endDate" class="join-item btn btn-neutral">
                  <Icon name="mdi:calendar-end-outline" size="20" />
                </label>
                <input
                  id="endDate"
                  v-model="endDate"
                  type="date"
                  min="1900-01-01"
                  :max="new Date().toISOString().split('T')[0]"
                  class="input input-bordered join-item w-full"
                  placeholder="End date"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full sm:flex">
        <div class="sm:flex gap-4">
          <!-- Sort -->
          <div class="max-w-fit">
            <p class="card-subtitle">
              Sort
            </p>
            <div class="form-control w-full max-w-xs pt-2">
              <div class="flex gap-2">
                <button v-if="order === 'desc'" class="btn btn-square btn-neutral" @click="order = 'asc'">
                  <Icon name="fa-solid:sort-amount-down" size="20" />
                </button>
                <button v-else class="btn btn-square btn-neutral" @click="order = 'desc'">
                  <Icon name="fa-solid:sort-amount-up" size="20" />
                </button>
                <Selector
                  v-model="sort"
                  class="join-item btn btn-square btn-neutral w-fit"
                  :items="[
                    { value: RecordQuerySort.Date, label: 'Date', icon: 'ic:baseline-calendar-month' },
                    { value: RecordQuerySort.Accuracy, label: 'Accuracy', icon: 'mdi:alpha-p-circle-outline' },
                    { value: RecordQuerySort.Score, label: 'Score', icon: 'material-symbols:sports-score' },
                    { value: RecordQuerySort.Rating, label: 'Rating', icon: 'mdi:database-outline' },
                    { value: RecordQuerySort.RecentRating, label: 'Recent rating', icon: 'mdi:database-clock-outline' },
                  ]"
                  @change="(v) => {
                    sort = v as RecordQuerySort
                  }"
                />
              </div>
            </div>
          </div>

          <!-- Is best -->
          <div class="pt-4 sm:pt-0">
            <p class="card-subtitle">
              Best Record
            </p>
            <div class="pt-4 sm:pt-0">
              <div class="join pt-2">
                <button
                  class="join-item btn btn-neutral"
                  :class="{
                    'btn-active': !best,
                  }"
                  @click="best = false"
                >
                  ALL
                </button>
                <button
                  class="join-item btn"
                  :class="{
                    'btn-active btn-primary': best,
                    'btn-neutral': !best,
                  }"
                  @click="best = !best"
                >
                  Best
                </button>
              </div>
            </div>
          </div>

          <!-- Is ranked (admin only) -->
          <div v-if="isModerator" class="pt-4 sm:pt-0">
            <p class="card-subtitle">
              Ranked
            </p>
            <div class="pt-4 sm:pt-0">
              <div class="join pt-2">
                <button
                  class="join-item btn"
                  :class="{
                    'btn-active btn-secondary': !ranked,
                    'btn-neutral': ranked,
                  }"
                  @click="ranked = false"
                >
                  Practice
                </button>
                <button
                  class="join-item btn"
                  :class="{
                    'btn-active btn-primary': ranked,
                    'btn-neutral': !ranked,
                  }"
                  @click="ranked = true"
                >
                  Ranked
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
