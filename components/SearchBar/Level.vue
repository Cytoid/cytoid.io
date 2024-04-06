<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router'

const route = useRoute()
const router = useRouter()

// router
const search = ref(route.query.search || '')
const order = computed({
  get() {
    return route.query.order || 'desc'
  },
  set(newVal) {
    updateRouter({ order: newVal })
  },
})
const featured = computed({
  get() {
    return route.query.featured === 'true' || false
  },
  set(newVal) {
    updateRouter({ featured: newVal ? 'true' : undefined })
  },
})
const qualified = computed({
  get() {
    return route.query.qualified === 'true' || false
  },
  set(newVal) {
    updateRouter({ qualified: newVal ? 'true' : undefined })
  },
})
const sort = computed<string>({
  get(): string {
    if (search.value !== '') {
      return route.query.sort?.toString() ?? 'relevance'
    }
    if (route.query.sort === 'relevance') {
      return 'creation_date'
    }
    if (qualified.value) {
      return route.query.sort?.toString() ?? 'modification_date'
    }
    return route.query.sort?.toString() ?? 'creation_date'
  },
  set(newVal) {
    updateRouter({ sort: newVal })
  },
})
function selectAll() {
  updateRouter({
    qualified: undefined,
    featured: undefined,
  })
}
const owner = computed<string | undefined>({
  get() {
    return route.query.owner?.toString() || undefined
  },
  set(newVal) {
    updateRouter({ owner: newVal })
  },
})
const tags = computed<string[]>({
  get() {
    return route.query.tags?.toString().split(',') || []
  },
  set(newVal) {
    if (newVal.length > 0) {
      updateRouter({ tags: newVal.join(',') })
    }
    else {
      updateRouter({ tags: undefined })
    }
  },
})
// eslint-disable-next-line unused-imports/no-unused-vars
function addTag(tag: string) {
  if (!tags.value.includes(tag)) {
    tags.value.push(tag)
  }
}
function removeTag(tag: string) {
  tags.value = tags.value.filter(t => t !== tag)
}

function updateSearch() {
  updateRouter({ search: search.value })
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
    <div class="card-body">
      <div v-if="owner || tags.length > 0" class="mb-4 flex flex-wrap items-center gap-4">
        <div v-if="owner" class="badge badge-lg flex h-8">
          <span class="ellipsis">
            Owner: {{ owner }}
          </span>
          <button class="btn btn-circle btn-xs ml-2" @click="owner = undefined">
            <Icon name="material-symbols:close" size="16" />
          </button>
        </div>
        <div v-for="tag in tags" :key="tag" class="badge badge-lg flex h-8">
          <span class="ellipsis">
            Tag: {{ tag }}
          </span>
          <button class="btn btn-circle btn-xs ml-2" @click="removeTag(tag)">
            <Icon name="material-symbols:close" size="16" />
          </button>
        </div>
      </div>
      <div class="form-control">
        <div class="join text-base-content">
          <input
            v-model="search" type="text" placeholder="Search levels..." class="input join-item input-bordered w-full"
            @keyup.enter="updateSearch"
          >
          <button class="btn btn-square btn-primary join-item" :disabled="search === route.query.search" @click="updateSearch">
            <Icon name="material-symbols:search" size="24" />
          </button>
        </div>
      </div>
      <div class="w-full pt-4 sm:flex">
        <div class="gap-4 sm:flex">
          <div class="max-w-fit">
            <p class="card-subtitle">
              {{ $t('levels.sort_select_title') }}
            </p>
            <div class="form-control w-full max-w-xs pt-2">
              <div class="flex items-center justify-center gap-2">
                <button v-if="order === 'desc'" class="btn btn-square join-item btn-neutral" @click="order = 'asc'">
                  <Icon name="fa-solid:sort-amount-down" size="20" />
                </button>
                <button v-else class="btn btn-square join-item btn-neutral" @click="order = 'desc'">
                  <Icon name="fa-solid:sort-amount-up" size="20" />
                </button>
                <Selector
                  v-model="sort"
                  class="btn btn-square join-item btn-neutral w-fit"
                  :items="[
                    { value: 'relevance', label: $t('levels.sort_select_relevance'), disabled: search.length === 0 },
                    { value: 'creation_date', label: $t('levels.sort_select_upload_date') },
                    { value: 'modification_date', label: $t('levels.sort_select_modification_date') },
                    { value: 'difficulty', label: $t('levels.sort_select_difficulty') },
                    { value: 'duration', label: $t('levels.sort_select_duration') },
                    { value: 'downloads', label: $t('levels.sort_select_downloads') },
                    { value: 'rating', label: $t('levels.sort_select_rating') },
                  ]"
                  @change="(s) => {
                    sort = s
                  }"
                />
              </div>
            </div>
          </div>
          <div class="pt-4 sm:pt-0">
            <p class="card-subtitle">
              {{ $t('levels.category_select_title') }}
            </p>
            <div class="join pt-2">
              <button
                class="btn join-item btn-neutral"
                :class="{
                  'btn-active': !(featured || qualified),
                }"
                @click="selectAll"
              >
                {{ $t('levels.category_select_item_all') }}
              </button>
              <button
                class="btn-fea btn join-item btn-neutral"
                :class="{
                  'bg-featured/75 btn-active': featured,
                }"
                @click="featured = !featured"
              >
                {{ $t('levels.category_select_item_featured') }}
              </button>
              <button
                class="btn-qua btn join-item btn-neutral"
                :class="{
                  'bg-qualified/75 btn-active': qualified,
                }"
                @click="qualified = !qualified"
              >
                {{ $t('levels.category_select_item_qualified') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
