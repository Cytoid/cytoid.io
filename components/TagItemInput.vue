<script setup lang="ts">
const itemsData = defineModel<Array<string>>({ required: true })

const suggestions = ref<string[]>([])

const updateSuggestions = useDebounceFn(async (value: string) => {
  if (value === '') {
    suggestions.value = []
    return
  }
  const { data } = await useServiceFetch<string[]>('/search/level_tags', {
    query: {
      search: value,
    },
  })
  if (data.value) {
    suggestions.value = data.value
  }
}, 500, { maxWait: 1000 })

function onInput(value: string) {
  updateSuggestions(value)
}
</script>

<template>
  <BaseItemInput
    v-model="itemsData"
    :on-input="onInput"
    :suggestion="suggestions"
  />
</template>
