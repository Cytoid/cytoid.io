<script setup lang="ts">
import { ResourceState } from '#build/urql-client/codegen/default/graphql'

const router = useRouter()

const query = gql(`
  query FetchCollectionsForStudio {
    my {
      collections {
        id
        uid
        title
        state
        levelCount
        cover {
          sized(height: 90, width: 160)
        }
        creationDate
      }
    }
  }
`)

const mutationCreateCollection = gql(`
  mutation StudioCreateCollection($data: CollectionInput!) {
    createCollection(input: $data) {
      id
      uid
    }
  }
`)
const mutationUpdateCollection = gql(`
  mutation UpdateCollectionsForStudio($id: ID!, $input: CollectionInput!) {
    updateCollection(id: $id, input: $input) {
      id
    }
  }
`)
const mutationDeleteCollection = gql(`
  mutation DeleteCollections($id: ID!) {
    deleteCollection(id: $id) {
      id
    }
  }
`)

const loading = ref(true)
const collections = ref<StudioCollectionData[]>([])

const newCollectionUid = ref('')
const newCollectionTitle = ref('')

// Create collection
const creatingCollection = ref(false)
async function createCollection() {
  if (!newCollectionUid.value || !newCollectionTitle.value) {
    return
  }
  try {
    await useMutation(mutationCreateCollection, {
      data: {
        title: newCollectionTitle.value,
        uid: newCollectionUid.value,
      },
    })
    successAlert(`Created collection ${newCollectionTitle.value}(${newCollectionUid.value})`)
    router.push({
      name: 'collections-id-manage',
      params: {
        id: newCollectionUid.value,
      },
    })
  }
  catch (error) {
    handleErrorToast(error as Error)
  }
}

// Delete collection
const willDeleteCollection = ref<ConfirmCollectionData | null>(null)
const openedDeleteConfirm = ref(false)
function openDeleteConfirm(level: ConfirmCollectionData) {
  willDeleteCollection.value = level
  openedDeleteConfirm.value = true
}
function closeDeleteConfirm() {
  willDeleteCollection.value = null
  openedDeleteConfirm.value = false
}
async function deleteLevel() {
  if (!willDeleteCollection.value) {
    return
  }
  const collection = willDeleteCollection.value
  openedDeleteConfirm.value = false
  await useMutation(mutationDeleteCollection, {
    id: collection.id.toString(),
  })
  successAlert(`Deleted level ${collection.title}(${collection.uid})`)
  willDeleteCollection.value = null

  // update level cache
  collections.value.splice(
    collections.value.findIndex(c => c.id === collection.id),
    1,
  )
}

// Change collection visibility
const willChangeVisCollection = ref<ConfirmCollectionData | null>(null)
const willChangeVisState = ref<ResourceState | null>(null)
const openedChangeVisConfirm = ref(false)
function openChangeVisConfirm(collection: ConfirmCollectionData, state: ResourceState) {
  willChangeVisCollection.value = collection
  willChangeVisState.value = state
  openedChangeVisConfirm.value = true
}

function closeChangeVisConfirm() {
  willChangeVisCollection.value = null
  willChangeVisState.value = null
  openedChangeVisConfirm.value = false
}
async function changeCollectionVisibility() {
  if (!willChangeVisCollection.value || !willChangeVisState.value) {
    return
  }
  const collection = willChangeVisCollection.value
  const state = willChangeVisState.value

  openedChangeVisConfirm.value = false
  await useMutation(mutationUpdateCollection, {
    id: collection.id.toString(),
    input: {
      state,
    },
  })
  successAlert(`Updated ${collection.title}(${collection.uid}) to ${state}`)
  willChangeVisCollection.value = null

  // update level cache
  collections.value = collections.value.map((l) => {
    if (l.id === collection.id) {
      return {
        ...l,
        state,
      }
    }
    return l
  })
}

onMounted(() => {
  nextTick(() => {
    loadCollections()
  })
})

async function loadCollections() {
  loading.value = true
  const data = await useQuery(query)
  if (!data?.my?.collections) {
    errorAlert('Failed to load collections')
    return
  }
  collections.value = data.my.collections
  loading.value = false
}

interface StudioCollectionData {
  id: string
  uid: string
  title: string
  state: ResourceState
  levelCount: number
  cover?: Maybe<{
    sized?: Maybe<string>
  }>
  creationDate: string
}
interface ConfirmCollectionData {
  id: string
  uid: string
  title: string
}
</script>

<template>
  <div class="flex w-full flex-col gap-5">
    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card-body gap-4">
        <h2 class="card-subtitle">
          Create a new collection
        </h2>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Title</span>
          </label>
          <input v-model="newCollectionTitle" type="text" class="input input-bordered w-full">
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Uid</span>
          </label>
          <input v-model="newCollectionUid" type="text" class="input input-bordered w-full">
        </div>

        <div class="flex flex-col items-end gap-2">
          <button
            class="btn btn-primary"
            :disabled="!newCollectionUid || !newCollectionTitle || creatingCollection"
            @click="createCollection"
          >
            <span v-if="loading" class="loading loading-spinner" />
            Create
          </button>
        </div>
      </div>
    </div>

    <div class="card w-full overflow-hidden bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-subtitle">
          Manage
        </h2>

        <!-- Collection List -->
        <div class="overflow-x-auto">
          <table class="table w-full">
            <!-- head -->
            <thead>
              <tr>
                <th>Collection</th>
                <th>Levels</th>
                <th>Creation Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="collection in collections" :key="collection.id">
                <!-- Collection Content -->
                <td class="flex items-center space-x-3">
                  <div class="flex gap-4">
                    <div
                      class="aspect-video h-12 rounded-lg bg-cover sm:h-20"
                      :style="`background-image: url(&quot;${collection.cover?.sized}&quot;)`"
                    >
                      <NuxtLink
                        :to="{ name: 'collections-id', params: { id: collection.uid } }"
                        class="block size-full bg-base-200 opacity-0 transition-opacity duration-200 hover:opacity-25"
                      />
                    </div>
                    <div class="flex max-w-64 flex-col justify-center">
                      <div class="truncate font-bold">
                        {{ collection.title }}
                      </div>
                      <div class="truncate text-sm opacity-50">
                        {{ collection.uid }}
                      </div>
                      <div class="flex-warp flex gap-1">
                        <div class="flex gap-1">
                          <NuxtLink
                            class="btn btn-circle btn-ghost btn-sm"
                            :to="{ name: 'collections-id-manage', params: { id: collection.uid } }"
                          >
                            <Icon name="mdi:briefcase-outline" size="18" />
                          </NuxtLink>
                          <button
                            class="btn btn-circle btn-ghost btn-sm"
                            :disabled="!!willDeleteCollection"
                            @click="openDeleteConfirm(collection)"
                          >
                            <Icon v-if="willDeleteCollection?.id === collection.id" name="mdi:loading" size="18" class="animate-spin" />
                            <Icon v-else name="mdi:delete-outline" size="18" />
                          </button>
                        </div>
                        <InnerSelector
                          v-model="collection.state"
                          :items="[
                            { value: ResourceState.Public, label: $t('general.visibility_status_public'), icon: 'mdi:earth' },
                            { value: ResourceState.Unlisted, label: $t('general.visibility_action_unlist'), icon: 'mdi:eye-off-outline' },
                            { value: ResourceState.Private, label: $t('general.visibility_status_private'), icon: 'mdi:lock-outline' },
                          ]"
                          @change="(v) => {
                            openChangeVisConfirm(collection, v as ResourceState)
                          }"
                        />
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Levels Count -->
                <td>
                  <!-- Old Rating -->
                  <div class="flex gap-2">
                    <span class="flex">
                      {{ collection.levelCount }}
                    </span>
                  </div>
                </td>

                <!-- Created at -->
                <td>
                  <div class="flex flex-col">
                    <template v-if="collection.creationDate">
                      <span class="flex whitespace-nowrap">
                        {{ dateFormatCalendar(collection.creationDate) }}
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
      </div>
    </div>
  </div>

  <CollectionDeleteConfirm
    v-if="!!willDeleteCollection"
    :open="openedDeleteConfirm"
    :collection="willDeleteCollection"
    :on-confirm="deleteLevel"
    :on-cancel="closeDeleteConfirm"
  />

  <CollectionVisibilityConfirm
    v-if="!!willChangeVisCollection && !!willChangeVisState"
    :open="openedChangeVisConfirm"
    :collection="willChangeVisCollection"
    :type="willChangeVisState"
    :on-confirm="changeCollectionVisibility"
    :on-cancel="closeChangeVisConfirm"
  />
</template>
