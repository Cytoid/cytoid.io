<script setup lang="ts">
import type { LocationQuery, LocationQueryRaw } from 'vue-router'

const route = useRoute()
const router = useRouter()

const levels = ref<levelQueryResponse[]>([])
const totalPagesCount = ref(0)
const totalLevelsCount = ref(0)
const loading = ref(true)

const haveLevel = computed(() => {
  return levels.value.length > 0
})

const search = ref(route.query.search || '')

const order = computed({
  get() {
    return route.query.order || 'desc'
  },
  set(newVal) {
    updateRouter({ order: newVal })
  },
})
const sort = computed({
  get() {
    if (search.value !== '') {
      return route.query.sort || 'relevance'
    }
    if (route.query.sort === 'relevance') {
      return 'creation_date'
    }
    return route.query.sort || 'creation_date'
  },
  set(newVal) {
    updateRouter({ sort: newVal })
  },
})
const page = computed({
  get() {
    const count = Number.parseInt(route.query.page?.toString() ?? '1')
    return count > 0 ? count : 1
  },
  set(newVal) {
    updateRouter({ page: newVal })
  },
})

watch(
  () => route.query,
  async () => {
    await syncData()
    if (window) {
      window.scroll(0, 0)
    }
  },
)

syncData()

// data fetch
const pageSize = 18
async function syncData() {
  loading.value = true
  const url = baseURL(route.query)
  const res = await $fetch.raw<levelQueryResponse[]>(useServiceUrl(url), {
    query: {
      ...route.query,
      sort: sort.value === 'relevance' ? undefined : sort.value,
      order: order.value,
      page: page.value - 1,
      limit: pageSize,
    },
  })
  totalLevelsCount.value = Number.parseInt(res.headers.get('x-total-entries') ?? '0')
  totalPagesCount.value = Math.ceil(totalLevelsCount.value / pageSize)
  if (res._data) {
    levels.value = [...res._data]
  }

  loading.value = false
  function baseURL(query: LocationQuery) {
    if (query.search) {
      return '/search/levels'
    }
    if (query.sort && !['creation_date', 'modification_date', 'duration', 'difficulty'].includes(query.sort.toString())) {
      return '/search/levels'
    }
    return '/levels'
  }
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
defineCytoidPage({
  title: 'Levels',
})
</script>

<template>
  <div>
    <SearchBarLevel />
    <progress v-if="loading" class="progress progress-info w-full" />

    <template v-if="haveLevel">
      <div
        class="mt-8 grid gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8"
        :class="{
          'opacity-60': loading,
        }"
      >
        <LevelCard
          v-for="level in levels" :key="level.id"
          :level="{
            ...level,
            bundle: {
              backgroundImage: {
                thumbnail: level.cover.thumbnail,
              },
              musicPreview: level.musicPreview,
            },
          }"
          class="h-56 shadow-xl"
        />
      </div>

      <progress v-if="loading" class="progress progress-info w-full" />

      <Pagination
        v-model="page"
        :total="totalPagesCount"
        class="w-full justify-center sm:justify-end"
      />
    </template>
    <template v-else-if="!loading">
      <div class="alert alert-warning mt-4">
        <Icon name="material-symbols:error-circle-rounded-outline" size="24" />
        <span>
          No level found.
        </span>
      </div>
    </template>
  </div>
</template>
