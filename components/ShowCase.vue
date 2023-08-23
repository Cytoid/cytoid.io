<script setup lang="ts">
import type { RouteLocationRaw } from '.nuxt/vue-router'

defineProps<{
  cover?: string | null
  more?: RouteLocationRaw
}>()

const showcaseItemOuterBox = ref<HTMLDivElement | null>(null)
const { x } = useScroll(showcaseItemOuterBox)
const isScrolled = computed(() => x.value > 0)
</script>

<template>
  <div class="card bg-base-100 w-full md:flex md:flex-row">
    <div class="relative card md:min-w-[20rem] md:w-80">
      <div class="absolute h-full w-full card overflow-hidden flex">
        <div
          class="flex-1 bg-cover bg-center transition-all"
          :style="`background-image: url(&quot;${cover}&quot;)`"
        >
          <div class="bg-black/60 transition h-full w-full" />
        </div>
      </div>

      <div class="h-fit w-full flex-1 flex z-10">
        <div class="h-full w-full p-3 flex-1 flex flex-col">
          <slot name="desperation" />
          <div class="flex-1" />
          <slot name="subDesperation" />
        </div>
      </div>
    </div>

    <div class="overflow-hidden mx-2 relative">
      <div ref="showcaseItemOuterBox" class="overflow-x-auto">
        <div class="showcase-items flex flex-row w-fit gap-1">
          <slot />
          <NuxtLink v-if="more" :to="more" class="more-btn w-20 flex flex-col gap-4 items-center justify-center">
            <button class="btn btn-circle btn-primary">
              <Icon name="mdi:chevron-right" size="24" />
            </button>
            {{ $t('general.more_btn') }}
          </NuxtLink>
        </div>
      </div>
      <div v-show="!isScrolled" class="absolute right-0 top-0 h-full w-24 flex items-center justify-end bg-gradient-to-r from-transparent to-gray-900/75">
        <div class="aspect-square w-8 -rotate-90">
          <Icon name="mdi:chevron-down" class="h-full w-full animate-bounce" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.showcase-items > *:not(.more-btn) {
  @apply max-w-[80%] w-80 m-2
}
</style>
