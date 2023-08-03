<script setup lang="ts">
const { isLogin } = useAuth()
</script>

<template>
  <div>
    <div class="hero h-[50vh] w-full min-h-[18rem] max-w-md mx-auto sm:max-w-full max-h-[36rem] relative sm:flex">
      <div class="absolute -top-12 sm:top-0 sm:right-0 sm:w-1/2 opacity-50 sm:opacity-100">
        <img src="/images/cryout.webp" class="w-auto h-auto max-w-full max-h-full">
      </div>
      <div class="hero-content">
        <div>
          <h1 class="text-5xl font-bold">
            <div class="w-full max-h-20">
              <div class="h-full sm:h-20 max-w-full max-h-full bg-contain bg-no-repeat bg-left-bottom" style="background-image: url(/images/logo.png);" />
            </div>
          </h1>
          <p class="py-6 ml-4">
            {{ $t('homepage.slogan') }}
          </p>
          <div class=" ml-4 flex flex-col sm:flex-row gap-2">
            <NuxtLink class="btn btn-primary" to="https://play.google.com/store/apps/details?id=me.tigerhix.cytoid" target="_blank">
              <Icon name="mdi:google-play" size="20" />
              {{ $t('homepage.download_googleplay') }}
            </NuxtLink>
            <NuxtLink class="btn btn-primary" to="https://apps.apple.com/us/app/cytoid/id1266582726" target="_blank">
              <Icon name="ion:ios-appstore" size="20" />
              {{ $t('homepage.download_appstore') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
