<script setup lang="ts">
import type { CollectionInput, FetchCollectionForEditingQuery } from '#build/urql-client/codegen/default/graphql'

const props = defineProps<{
  modelValue: FetchCollectionForEditingQuery
  submit: (data: CollectionInput, levelCache?: { id: number, uid: string, title: string }[]) => Promise<void>
}>()
const emit = defineEmits(['update:modelValue'])
const data = useVModel(props, 'modelValue', emit)

const verifyQuery = gql(`
  query VerifyLevelsForCollection($id: String!) {
    level(uid: $id) {
      id
      uid
      title
    }
  }
`)

const levelIdList = ref<string[]>(data.value.collection?.levels?.map(
  level => level.uid,
) ?? [])
const suggestions = ref<string[]>([])

const verified = ref<{ [key: string]: string | undefined | null }>((() => {
  const verified: { [key: string]: string | undefined | null } = {}
  data.value.collection?.levels?.forEach((level) => {
    verified[level.uid] = level.title
  })
  return verified
})())

const cache = ref<{ id: number, uid: string, title: string }[]>((() => {
  const cache: { id: number, uid: string, title: string }[] = []
  data.value.collection?.levels?.forEach((level) => {
    cache.push({
      id: level.id,
      uid: level.uid,
      title: level.title,
    })
  })
  return cache
})())

const isAllVerified = computed(() => {
  return levelIdList.value.every(levelId => !!verified.value[levelId])
})

const updateSuggestions = useDebounceFn(async (value: string) => {
  if (value === '') {
    suggestions.value = []
    return
  }
  const { data } = await useServiceFetch<{ id: number, uid: string, title: string }[]>('/search/level_uids', {
    query: {
      search: value,
    },
  })
  if (data.value) {
    suggestions.value = data.value.map(level => level.uid)
    verified.value = {
      ...verified.value,
      ...data.value.reduce((acc, level) => {
        acc[level.uid] = level.title
        return acc
      }, {} as { [key: string]: string | undefined | null }),
    }
    cache.value = [
      ...cache.value,
      ...data.value,
    ]
  }
}, 500, { maxWait: 1000 })

const verifyLevel = useDebounceFn(async () => {
  const unverifiedLevels = levelIdList.value.filter(levelId => !verified.value[levelId])
  for (const levelId of unverifiedLevels) {
    const data = await useQuery(verifyQuery, {
      id: levelId,
    })
    verified.value[levelId] = data?.level?.title ?? null
    cache.value.push({
      id: data?.level?.id ?? 0,
      uid: data?.level?.uid ?? '',
      title: data?.level?.title ?? '',
    })
  }
}, 500, { maxWait: 1000 })
watch(levelIdList, verifyLevel)

function onInput(value: string) {
  updateSuggestions(value)
}

function submit() {
  props.submit({
    levelIds: levelIdList.value.map((levelId) => {
      const level = cache.value.find(level => level.uid === levelId)
      if (level) {
        return level.id
      }
      return 0
    }),
  }, cache.value.filter(level => levelIdList.value.includes(level.uid)))
}
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <div class="card bg-base-100 w-full shadow-xl">
      <div class="card-body gap-4">
        <!-- Title -->
        <div class="flex flex-col gap-2">
          <h2 class="card-subtitle">
            LEVELS
          </h2>
          <BaseItemInput
            v-model="levelIdList"
            :on-input="onInput"
            :suggestion="suggestions"
            :verified="verified"
          />
        </div>
        <div class="card-actions justify-end">
          <button
            class="btn btn-primary"
            :disabled="!isAllVerified"
            @click="submit"
          >
            {{ $t('general.save_btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
