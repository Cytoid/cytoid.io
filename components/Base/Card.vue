<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to?: RouteLocationRaw | null
  cover?: string | null
}>()

const [defineBaseCardBody, BaseCardBody] = createReusableTemplate()
</script>

<template>
  <div class="min-w-84 card flex max-h-60 flex-col bg-base-100">
    <defineBaseCardBody>
      <div class="base-card bg-image-loading w-full flex-1">
        <div class="card absolute flex size-full overflow-hidden">
          <div
            class="base-card-bg flex-1 bg-cover bg-center transition-all"
            :style="`background-image: url(&quot;${cover}&quot;)`"
          >
            <div class="base-card-bg-cover size-full bg-black/60 transition" />
          </div>
        </div>
        <div class="absolute size-full">
          <div class="flex size-full flex-col p-3">
            <slot />
          </div>
        </div>
      </div>
    </defineBaseCardBody>

    <NuxtLink v-if="to" :to="to" class="flex flex-1">
      <BaseCardBody />
    </NuxtLink>
    <div v-else class="flex flex-1">
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
