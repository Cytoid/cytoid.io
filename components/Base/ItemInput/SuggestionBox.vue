<script setup lang="ts">
const props = defineProps<{
  suggestion: Array<string>
  nameCache?: { [key: string]: string | undefined | null }
  selectSuggestion: (val: string) => void
}>()

function getName(item: string) {
  return props.nameCache ? `${props.nameCache[item]} (${item})` : item
}
</script>

<template>
  <div class="absolute -bottom-2 z-20 h-0 w-full">
    <div
      class="w-full rounded-lg bg-base-200 shadow-xl"
    >
      <div class="p-2">
        <button
          v-for="item, i in suggestion" :key="i"
          class="badge badge-neutral badge-lg m-1"
          @click="selectSuggestion(item)"
        >
          {{ getName(item) }}
        </button>
      </div>
    </div>
  </div>
</template>
