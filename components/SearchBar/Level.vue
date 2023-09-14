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
const sort = computed({
  get() {
    if (search.value !== '') {
      return route.query.sort ?? 'relevance'
    }
    if (route.query.sort === 'relevance') {
      return 'creation_date'
    }
    if (qualified.value) {
      return route.query.sort ?? 'modification_date'
    }
    return route.query.sort ?? 'creation_date'
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
      <div v-if="owner" class="flex items-center flex-wrap mb-4 gap-4">
        <div class="hidden" />
        <div class="badge badge-lg h-8 flex">
          <span class="ellipsis">
            Owner: {{ owner }}
          </span>
          <button class="btn btn-circle btn-xs ml-2" @click="owner = undefined">
            <Icon name="material-symbols:close" size="16" />
          </button>
        </div>
      </div>
      <div class="form-control">
        <div class="join text-base-content">
          <input
            v-model="search" type="text" placeholder="Search levels..." class="join-item input input-bordered w-full"
            @keyup.enter="updateSearch"
          >
          <button class="join-item btn btn-primary btn-square" :disabled="search === route.query.search" @click="updateSearch">
            <Icon name="material-symbols:search" size="24" />
          </button>
        </div>
      </div>
      <div class="pt-4 w-full sm:flex">
        <div class="sm:flex gap-4">
          <div class="max-w-fit">
            <p class="card-subtitle">
              {{ $t('levels.sort_select_title') }}
            </p>
            <div class="form-control w-full max-w-xs pt-2">
              <div class="join">
                <button v-if="order === 'desc'" class="join-item btn btn-square btn-neutral" @click="order = 'asc'">
                  <Icon name="fa-solid:sort-amount-down" size="20" />
                </button>
                <button v-else class="join-item btn btn-square btn-neutral" @click="order = 'desc'">
                  <Icon name="fa-solid:sort-amount-up" size="20" />
                </button>
                <select v-model="sort" class="join-item select select-bordered">
                  <option value="relevance" :disabled="search.length === 0">
                    {{ $t('levels.sort_select_relevance') }}
                  </option>
                  <option value="creation_date">
                    {{ $t('levels.sort_select_upload_date') }}
                  </option>
                  <option value="modification_date">
                    {{ $t('levels.sort_select_modification_date') }}
                  </option>
                  <option value="difficulty">
                    {{ $t('levels.sort_select_difficulty') }}
                  </option>
                  <option value="duration">
                    {{ $t('levels.sort_select_duration') }}
                  </option>
                  <option value="downloads">
                    {{ $t('levels.sort_select_downloads') }}
                  </option>
                  <option value="rating">
                    {{ $t('levels.sort_select_rating') }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="pt-4 sm:pt-0">
            <p class="card-subtitle">
              {{ $t('levels.category_select_title') }}
            </p>
            <div class="join pt-2">
              <button
                class="join-item btn btn-neutral"
                :class="{
                  'btn-active': !(featured || qualified),
                }"
                @click="selectAll"
              >
                {{ $t('levels.category_select_item_all') }}
              </button>
              <button
                class="join-item btn btn-fea btn-neutral"
                :class="{
                  'btn-active bg-featured/75': featured,
                }"
                @click="featured = !featured"
              >
                {{ $t('levels.category_select_item_featured') }}
              </button>
              <button
                class="join-item btn btn-qua btn-neutral"
                :class="{
                  'btn-active bg-qualified/75': qualified,
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
