<script setup lang="ts">
import type { FetchPostForEditingQuery, PostInput } from '#build/urql-client/codegen/default/graphql'

const props = defineProps<{
  submit: (
    input: PostInput,
    levelData?: { id: number, uid: string, title: string },
    collectionData?: { id: string, uid: string, title: string },
  ) => Promise<void>
}>()
const data = defineModel<FetchPostForEditingQuery>({ required: true })

const levelId = ref(data.value.post?.level?.uid ?? null)
const collectionId = ref(data.value.post?.collection?.uid ?? null)
const startDate = ref<string>(data.value.post?.startDate ?? null)
const endDate = ref<string>(data.value.post?.endDate ?? null)

// id -> title pairs
// - null means none
// - undefined means loading
const levelCache = ref<{
  [key: string]: {
    id: number
    uid: string
    title: string
  } | null
}>(data.value.post?.level?.uid
  ? {
      [data.value.post.level.uid]: {
        id: data.value.post.level.id,
        uid: data.value.post.level.uid,
        title: data.value.post.level.title,
      },
    }
  : {},
)
const collectionCache = ref<{
  [key: string]: {
    id: string
    uid: string
    title: string
  } | null
}>(data.value.post?.collection?.uid
  ? {
      [data.value.post?.collection?.uid]: {
        id: data.value.post.collection.id,
        uid: data.value.post.collection.uid,
        title: data.value.post.collection.title,
      },
    }
  : {},
)

const verifyLevel = useDebounceFn(async (uid: string) => {
  // skip if founded
  if (levelCache.value[uid] !== undefined) {
    return
  }

  const { data } = await useServiceFetch<{ id: number, uid: string, title: string }[]>('/search/level_uids', {
    query: {
      search: uid,
    },
  })
  if (data.value) {
    // join all to cache
    data.value.forEach((level) => {
      levelCache.value[level.uid] = {
        id: level.id,
        uid: level.uid,
        title: level.title,
      }
    })
    // if uid not in list, means not found
    const founded = data.value.find(level => level.uid === uid)
    if (!founded) {
      levelCache.value[uid] = null
    }
  }
}, 500, { maxWait: 1000 })
const verifyCollection = useDebounceFn(async (uid: string) => {
  // skip if founded
  if (collectionCache.value[uid] !== undefined) {
    return
  }

  const { data } = await useServiceFetch<{ id: string, uid: string, title: string }[]>('/search/collection_uids', {
    query: {
      search: uid,
    },
  })
  if (data.value) {
    // join all to cache
    data.value.forEach((collection) => {
      collectionCache.value[collection.uid] = {
        id: collection.id,
        uid: collection.uid,
        title: collection.title,
      }
    })
    // if uid not in list, means not found
    const founded = data.value.find(collection => collection.uid === uid)
    if (!founded) {
      collectionCache.value[uid] = null
    }
  }
}, 500, { maxWait: 1000 })

watch(levelId, (value) => {
  if (value) {
    verifyLevel(value)
  }
})
watch(collectionId, (value) => {
  if (value) {
    verifyCollection(value)
  }
})

const canSubmit = computed(() => {
  const collectionVerified = collectionId.value
    ? !!collectionCache.value[collectionId.value]
    : true
  const levelVerified = levelId.value
    ? !!levelCache.value[levelId.value]
    : true
  return collectionVerified && levelVerified
})

function submit() {
  const levelData = levelId.value ? levelCache.value[levelId.value] : undefined
  const collectionData = collectionId.value ? collectionCache.value[collectionId.value] : undefined

  props.submit(
    {
      levelId: levelId.value ? levelCache.value[levelId.value]?.id : null,
      collectionId: collectionId.value ? collectionCache.value[collectionId.value]?.id : null,
      startDate: startDate.value || null,
      endDate: endDate.value || null,
    },
    levelData ?? undefined,
    collectionData ?? undefined,
  )
}
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div class="card bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Associated Level
          </h2>
          <BaseItemSelect
            id="level-select"
            v-model="levelId"
            :verified="levelId
              ? levelCache[levelId] === null
                ? null
                : levelCache[levelId]?.title ?? undefined
              : undefined"
            icon="mdi:folder"
          />
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Associated Collection
          </h2>
          <BaseItemSelect
            id="collection-select"
            v-model="collectionId"
            :verified="collectionId
              ? collectionCache[collectionId] === null
                ? null
                : collectionCache[collectionId]?.title ?? undefined
              : undefined"
            icon="mdi:folder-multiple"
          />
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            Start Date
          </h2>
          <div class="form-control">
            <div class="join w-full">
              <label for="startDate" class="join-item btn btn-neutral">
                <Icon name="mdi:ray-start" size="20" />
              </label>
              <input
                v-model="startDate" type="datetime-local"
                min="1900-01-01T00:00"
                class="join-item input input-bordered flex-1 w-full"
              >
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            End Date
          </h2>
          <div class="form-control">
            <div class="join w-full">
              <label for="endDate" class="join-item btn btn-neutral">
                <Icon name="mdi:ray-end" size="20" />
              </label>
              <input
                v-model="endDate" type="datetime-local"
                min="1900-01-01T00:00"
                class="join-item input input-bordered flex-1 w-full"
              >
            </div>
          </div>
        </div>

        <div class="card-actions justify-end">
          <button
            class="btn btn-primary"
            :disabled="!canSubmit"
            @click="submit"
          >
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
