<script setup lang="ts">
import { ResourceState } from '#build/urql-client/codegen/default/graphql'

const query = gql(`
  query FetchLevelForStudio($limit: Int!, $start: Int!) {
    my {
      levelsCount
      levels(start: $start, limit: $limit) {
        id
        uid
        title
        creationDate
        bundle {
          backgroundImage {
            sized(height: 90, width: 160)
          }
        }
        state
        avgRating
        ratingCount
        downloadCount
        playCount
      }
    }
  }
`)
const mutationUpdateLevel = gql(`
  mutation UpdateLevel($id: ID!, $input: UpdateLevelInput!) {
    updateLevel(id: $id, input: $input)
  }
`)
const mutationDeleteLevel = gql(`
  mutation DeleteLevel($id: ID!) {
    deleteLevel(id: $id)
  }
`)

const loading = ref(true)
const levels = ref<StudioLevelData[]>([])
const totalLevels = ref(0)

const page = ref(1)
const limit = ref(10)
const totalPages = computed(() => Math.ceil(totalLevels.value / limit.value))

onMounted(() => {
  nextTick(() => {
    loadLevels(page.value)
  })
})
watch(page, (val) => {
  loadLevels(val)
})

// Delete Level
const willDeleteLevel = ref<ConfirmLevelData | null>(null)
const openedDeleteConfirm = ref(false)
function openDeleteConfirm(level: ConfirmLevelData) {
  willDeleteLevel.value = level
  openedDeleteConfirm.value = true
}
function closeDeleteConfirm() {
  willDeleteLevel.value = null
  openedDeleteConfirm.value = false
}
async function deleteLevel() {
  if (!willDeleteLevel.value) {
    return
  }
  const level = willDeleteLevel.value
  openedDeleteConfirm.value = false
  await useMutation(mutationDeleteLevel, {
    id: level.id.toString(),
  })
  successAlert(`Deleted level ${level.title}(${level.uid})`)
  willDeleteLevel.value = null

  // update level cache
  levels.value.splice(
    levels.value.findIndex(l => l.id === level.id),
    1,
  )
}

// Change level visibility
const willChangeVisLevel = ref<ConfirmLevelData | null>(null)
const willChangeVisState = ref<ResourceState | null>(null)
const openedChangeVisConfirm = ref(false)
function openChangeVisConfirm(level: ConfirmLevelData, state: ResourceState) {
  willChangeVisLevel.value = level
  willChangeVisState.value = state
  openedChangeVisConfirm.value = true
}
function closeChangeVisConfirm() {
  willChangeVisLevel.value = null
  willChangeVisState.value = null
  openedChangeVisConfirm.value = false
}
async function changeLevelVisibility() {
  if (!willChangeVisLevel.value || !willChangeVisState.value) {
    return
  }
  const level = willChangeVisLevel.value
  const state = willChangeVisState.value

  openedChangeVisConfirm.value = false
  await useMutation(mutationUpdateLevel, {
    id: level.id.toString(),
    input: {
      state,
    },
  })
  successAlert(`Updated ${level.title}(${level.uid}) to ${state}`)
  willChangeVisLevel.value = null

  // update level cache
  levels.value = levels.value.map((l) => {
    if (l.id === level.id) {
      return {
        ...l,
        state,
      }
    }
    return l
  })
}
async function loadLevels(page: number) {
  loading.value = true
  const data = await useQuery(query, {
    limit: limit.value,
    start: (page - 1) * limit.value,
  })
  if (!data?.my?.levels) {
    errorAlert('Failed to load levels')
    return
  }
  levels.value = data.my.levels
  totalLevels.value = data.my.levelsCount
  loading.value = false
}

interface StudioLevelData {
  id: number
  uid: string
  title: string
  creationDate: Maybe<string>
  state: ResourceState
  avgRating?: Maybe<number>
  ratingCount?: Maybe<number>
  downloadCount?: Maybe<number>
  playCount?: Maybe<number>
  bundle?: Maybe<{
    backgroundImage?: Maybe<{
      sized?: Maybe<string>
    }>
  }>
}

interface ConfirmLevelData {
  id: number
  uid: string
  title: string
}
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <LevelUploader />
    <div class="card w-full bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Manage
        </h2>

        <!-- Level List -->
        <div class="overflow-x-scroll">
          <table class="table w-full">
            <!-- head -->
            <thead>
              <tr>
                <th>Level</th>
                <th>Analytics</th>
                <th>Rating</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody class="overflow-y-visible">
              <tr v-for="level in levels" :key="level.uid">
                <!-- Level Content -->
                <td class="flex items-center space-x-3">
                  <div class="flex gap-4">
                    <div
                      class="aspect-video h-12 rounded-lg bg-cover sm:h-20"
                      :style="`background-image: url(&quot;${level.bundle?.backgroundImage?.sized}&quot;)`"
                    >
                      <NuxtLink
                        :to="{ name: 'levels-id', params: { id: level.uid } }"
                        class="block size-full bg-base-200 opacity-0 transition-opacity duration-200 hover:opacity-25"
                      />
                    </div>
                    <div class="flex max-w-64 flex-col justify-center">
                      <div class="truncate font-bold">
                        {{ level.title }}
                      </div>
                      <div class="truncate text-sm opacity-50">
                        {{ level.uid }}
                      </div>
                      <div class="flex-warp flex gap-1">
                        <div class="flex gap-1">
                          <NuxtLink
                            class="btn btn-circle btn-ghost btn-sm"
                            :to="{ name: 'levels-id-manage', params: { id: level.uid } }"
                          >
                            <Icon name="mdi:briefcase-outline" size="18" />
                          </NuxtLink>
                          <button
                            class="btn btn-circle btn-ghost btn-sm"
                            :disabled="!!willDeleteLevel"
                            @click="openDeleteConfirm(level)"
                          >
                            <Icon v-if="willDeleteLevel?.id === level.id" name="mdi:loading" size="18" class="animate-spin" />
                            <Icon v-else name="mdi:delete-outline" size="18" />
                          </button>
                        </div>
                        <div class="h-0 overflow-visible">
                          <InnerSelector
                            v-model="level.state"
                            :items="[
                              { value: ResourceState.Public, label: $t('general.visibility_status_public'), icon: 'mdi:earth' },
                              { value: ResourceState.Unlisted, label: $t('general.visibility_status_unlisted'), icon: 'mdi:eye-off-outline' },
                              { value: ResourceState.Private, label: $t('general.visibility_status_private'), icon: 'mdi:lock-outline' },
                            ]"
                            @change="(v) => {
                              openChangeVisConfirm(level, v as ResourceState)
                            }"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Downloads / Plays Count -->
                <td>
                  <div class="flex flex-col">
                    <div class="flex items-center">
                      <Icon name="mdi:download-outline" size="20" />
                      {{ level.downloadCount ?? 0 }}
                    </div>
                    <div class="flex items-center">
                      <Icon name="mdi:play-outline" size="20" />
                      {{ level.playCount ?? 0 }}
                    </div>
                  </div>
                </td>

                <!-- Rating -->
                <td>
                  <!-- Old Rating -->
                  <div class="flex gap-2">
                    <span class="flex">
                      <Icon class="text-blue-300" name="material-symbols:keyboard-arrow-up-rounded" />
                      <Icon class="text-orange-300" name="material-symbols:keyboard-arrow-down-rounded" />
                    </span>
                    <span class="flex">
                      {{ level.avgRating ? truncateNum(level.avgRating / 2) : 'N/A' }}
                    </span>
                    <span class="flex">
                      ({{ level.ratingCount ?? 0 }})
                    </span>
                  </div>
                </td>

                <!-- Created at -->
                <td>
                  <!-- Old Rating -->
                  <div class="flex flex-col">
                    <template v-if="level.creationDate">
                      <span class="flex whitespace-nowrap">
                        {{ dateFormatCalendar(level.creationDate) }}
                      </span>
                    </template>
                    <span v-else class="flex">
                      N/A
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- loading bar -->
        <progress
          class="progress progress-primary"
          :class="{
            'opacity-0': !loading,
          }"
        />

        <!-- Pagination -->
        <PaginationLite
          v-if="totalLevels > 10"
          v-model="page" :total="totalPages"
          class="w-full justify-center sm:justify-end"
        />
      </div>
    </div>
  </div>

  <LevelDeleteConfirm
    v-if="!!willDeleteLevel"
    :open="openedDeleteConfirm"
    :level="willDeleteLevel"
    :on-confirm="deleteLevel"
    :on-cancel="closeDeleteConfirm"
  />

  <LevelVisibilityConfirm
    v-if="!!willChangeVisLevel && !!willChangeVisState"
    :open="openedChangeVisConfirm"
    :level="willChangeVisLevel"
    :type="willChangeVisState"
    :on-confirm="changeLevelVisibility"
    :on-cancel="closeChangeVisConfirm"
  />
</template>
