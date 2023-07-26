<script setup lang="ts">
defineProps<{
  rating: number
}>()
</script>

<template>
  <div
    v-if="rating >= 16" class="tooltip tooltip-right"
    :data-tip="`rt ${rating.toFixed(2)}`"
  >
    <div class="badge badge-warning">
      <Icon name="mdi:crown" />
    </div>
  </div>
  <div v-else-if="rating > 15" class="badge badge-warning">
    rt {{ rating.toFixed(2) }}
  </div>
  <div v-else-if="rating > 12" class="badge badge-info">
    rt {{ rating.toFixed(2) }}
  </div>
  <div v-else class="badge badge-neutral">
    rt {{ rating.toFixed(2) }}
  </div>
</template>
