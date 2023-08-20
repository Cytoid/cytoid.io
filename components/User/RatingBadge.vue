<script setup lang="ts">
defineProps<{
  rating: number
}>()
</script>

<template>
  <div
    v-if="rating >= 16" class="tooltip tooltip-right"
    :data-tip="`rt ${truncateNum(rating)}`"
  >
    <div class="badge badge-warning">
      <Icon name="mdi:crown" />
    </div>
  </div>
  <div v-else-if="rating > 15" class="badge badge-warning">
    rt {{ truncateNum(rating) }}
  </div>
  <div v-else-if="rating > 12" class="badge badge-info">
    rt {{ truncateNum(rating) }}
  </div>
  <div v-else class="badge badge-neutral">
    rt {{ truncateNum(rating) }}
  </div>
</template>
