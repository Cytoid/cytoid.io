<script setup lang="ts">
defineProps<{
  cover?: string | null
}>()
</script>

<template>
  <div class="card bg-base-100 w-full md:flex md:flex-row">
    <div class="relative card md:min-w-[20rem] md:w-80">
      <div class="absolute h-full w-full card overflow-hidden flex">
        <div
          class="flex-1 bg-cover bg-center transition-all"
          :style="`background-image: url('${cover}')`"
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

    <div class="overflow-hidden mx-2">
      <div class="overflow-x-auto">
        <div class="showcase-items flex flex-row w-fit gap-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.showcase-items > * {
  @apply max-w-xs w-80 m-2
}
</style>
