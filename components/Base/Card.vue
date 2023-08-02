<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to?: RouteLocationRaw | null
  cover?: string | null
}>()

const [defineBaseCardBody, BaseCardBody] = createReusableTemplate()
</script>

<template>
  <div class="card min-w-84 max-h-60 bg-base-100 flex flex-col">
    <defineBaseCardBody>
      <div class="base-card w-full flex-1 bg-image-loading">
        <div class="absolute h-full w-full card overflow-hidden flex">
          <div
            class="base-card-bg flex-1 bg-cover bg-center transition-all"
            :style="`background-image: url('${cover}')`"
          >
            <div class="base-card-bg-cover bg-black/60 transition h-full w-full" />
          </div>
        </div>
        <div class="absolute h-full w-full">
          <div class="h-full w-full p-3 flex flex-col">
            <slot />
          </div>
        </div>
      </div>
    </defineBaseCardBody>

    <NuxtLink v-if="to" :to="to" class="flex-1 flex">
      <BaseCardBody />
    </NuxtLink>
    <div v-else class="flex-1 flex">
      <BaseCardBody />
    </div>
  </div>
</template>

<style scoped>
.base-card:hover .base-card-bg {
  @apply scale-105
}

.base-card:hover .base-card-bg > .base-card-bg-cover {
  @apply bg-black/25
}
</style>
