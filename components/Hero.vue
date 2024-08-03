<script setup lang="ts">
withDefaults(defineProps<{
  downloads?: boolean
}>(), {
  downloads: true,
})
</script>

<template>
  <div>
    <div class="hero relative mx-auto h-[50vh] max-h-[36rem] min-h-72 w-full max-w-md sm:flex sm:max-w-full">
      <div class="absolute -top-12 opacity-50 sm:right-0 sm:top-0 sm:w-1/2 sm:opacity-100">
        <img src="/images/cryout.webp" class="size-auto max-h-full max-w-full">
      </div>
      <div class="hero-content size-full">
        <div class="mr-4 flex size-full flex-col sm:justify-center">
          <h1 class="flex flex-1 items-end text-5xl font-bold sm:flex-initial">
            <div class="size-full max-h-20">
              <div class="h-full max-h-full max-w-full bg-contain bg-center bg-no-repeat sm:h-20 sm:bg-left-bottom" style="background-image: url(/images/logo.webp);" />
            </div>
          </h1>
          <p class="ml-4 py-6">
            {{ $t('homepage.slogan') }}
          </p>
          <div v-if="downloads" class="ml-4 flex flex-col gap-2 sm:flex-row">
            <NuxtLink class="btn btn-primary flex-nowrap" to="https://play.google.com/store/apps/details?id=me.tigerhix.cytoid" target="_blank">
              <Icon name="mdi:google-play" size="20" />
              <span class="flex-1">
                {{ $t('homepage.download_googleplay') }}
              </span>
            </NuxtLink>
            <NuxtLink class="btn btn-primary flex-nowrap" to="https://apps.apple.com/us/app/cytoid/id1266582726" target="_blank">
              <Icon name="ion:ios-appstore" size="20" />
              <span class="flex-1">
                {{ $t('homepage.download_appstore') }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
