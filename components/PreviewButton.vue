<script setup lang="ts">
const props = defineProps<{
  previewUrl: string
}>()
const { previewState } = usePreviewState()
const loaded = computed(() =>
  (previewState.value.state === 'playing' || previewState.value.state === 'paused')
  && previewState.value.url === props.previewUrl,
)
const playing = computed(() => previewState.value.state === 'playing')
const progress = computed(() => {
  if (previewState.value.state === 'playing' || previewState.value.state === 'paused') {
    return previewState.value.currentTime / previewState.value.duration * 100
  }
  return null
})
const loading = computed(() => previewState.value.state === 'loading' && previewState.value.url === props.previewUrl)
</script>

<template>
  <button class="btn btn-circle btn-ghost btn-sm" @click.stop.prevent="orderPreview(previewUrl)">
    <Icon v-if="loading" name="mdi:loading" size="32" class="animate-spin" />
    <div v-else-if="loaded && progress" class="radial-progress after:content-none" :style="`--value:${progress.toFixed(2)}; --size: 2rem; --thickness: 0.15rem;`">
      <Icon v-if="playing" name="mdi:stop" size="24" />
      <Icon v-else name="mdi:play" size="24" />
    </div>
    <Icon v-else name="mdi:play" size="24" />
  </button>
</template>
