<script setup lang="ts">
const props = defineProps<{
  suggestion: Array<string>
  nameCache?: { [key: string]: string | undefined | null }
  selectSuggestion: (val: string) => void
}>()

function getName(item: string) {
  return props.nameCache?.[item] ?? item
}
</script>

<template>
  <div class="absolute -bottom-2 h-0 w-full z-20">
    <div
      class="bg-base-200 w-full shadow-xl rounded-lg"
    >
      <div class="p-2">
        <button
          v-for="item, i in suggestion" :key="i"
          class="badge badge-lg badge-neutral m-1"
          @click="selectSuggestion(item)"
        >
          {{ getName(item) }}
        </button>
      </div>
    </div>
  </div>
</template>
