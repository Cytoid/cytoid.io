<script setup lang="ts">
const props = defineProps<{
  previewUrl: string
}>()
const { previewState } = usePreviewState()
const progress = computed(() => {
  if (previewState.value.state === 'playing' && previewState.value.url === props.previewUrl) {
    return previewState.value.currentTime / previewState.value.duration * 100
  }
  return null
})
const loading = computed(() => previewState.value.state === 'loading' && previewState.value.url === props.previewUrl)
</script>

<template>
  <button class="btn btn-circle btn-sm btn-ghost" @click.prevent.stop="orderPreview(previewUrl)">
    <Icon v-if="loading" name="mdi:loading" size="32" class="animate-spin" />
    <div v-else-if="progress" class="radial-progress" :style="`--value:${progress}; --size: 2rem; --thickness: 0.15rem;`">
      <Icon name="mdi:stop" size="24" />
    </div>
    <Icon v-else name="mdi:play" size="24" />
  </button>
</template>
