<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  cover?: string | null
  more?: RouteLocationRaw
}>()

const showcaseItemOuterBox = ref<HTMLDivElement | null>(null)
const { x } = useScroll(showcaseItemOuterBox)
const isScrolled = computed(() => x.value > 0)
</script>

<template>
  <div class="card w-full bg-base-100 md:flex md:flex-row">
    <div class="card relative md:w-80 md:min-w-80">
      <div class="card absolute flex size-full overflow-hidden">
        <div
          class="flex-1 bg-cover bg-center transition-all"
          :style="`background-image: url(&quot;${cover}&quot;)`"
        >
          <div class="size-full bg-black/60 transition" />
        </div>
      </div>

      <div class="z-10 flex h-fit w-full flex-1">
        <div class="flex size-full flex-1 flex-col p-3">
          <slot name="desperation" />
          <div class="flex-1" />
          <slot name="subDesperation" />
        </div>
      </div>
    </div>

    <div class="relative mx-2 overflow-hidden">
      <div ref="showcaseItemOuterBox" class="overflow-x-auto">
        <div class="showcase-items flex w-fit flex-row gap-1">
          <slot />
          <NuxtLink v-if="more" :to="more" class="more-btn flex w-20 flex-col items-center justify-center gap-4">
            <button class="btn btn-circle btn-primary">
              <Icon name="mdi:chevron-right" size="24" />
            </button>
            {{ $t('general.more_btn') }}
          </NuxtLink>
        </div>
      </div>
      <div v-show="!isScrolled" class="absolute right-0 top-0 flex h-full w-24 items-center justify-end bg-gradient-to-r from-transparent to-gray-900/75">
        <div class="aspect-square w-8 -rotate-90">
          <Icon name="mdi:chevron-down" class="size-full animate-bounce" />
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
