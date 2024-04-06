<script setup lang="ts">
const images = [
  ...Array.from({ length: 8 }, (_, i) => `/images/preview/phone_${i + 1}.webp`),
  ...Array.from({ length: 8 }, (_, i) => `/images/preview/tablet_${i + 1}.webp`),
]
useSWR()
resetCytoidPage()
</script>

<template>
  <div class="hero relative mx-auto h-[25vh] max-h-[36rem] min-h-40 w-full max-w-md sm:flex sm:max-w-full">
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
      </div>
    </div>
  </div>

  <div class="mt-4 md:grid md:grid-flow-col md:grid-cols-12 md:gap-4">
    <div class="col-span-7 mt-4 md:mt-0 lg:col-span-8">
      <!-- Official -->
      <div
        class="card mb-4 w-full overflow-hidden bg-base-100 shadow-xl"
      >
        <div class="card card-body bg-secondary/25">
          <h2 class="card-subtitle">
            Download
          </h2>
          <div class="carousel h-40 space-x-4 rounded-box">
            <div v-for="image of images" :key="image" class="carousel-item">
              <img :src="image" class="h-40 rounded-box">
            </div>
          </div>
          <p>
            "Let's shape the rhythm world... together!"
          </p>
          <p>
            Welcome to Cytoid, an open-source rhythm game where you can create, share and play your own levels! Based on the classic scanner-style gameplay and powered by the community, Cytoid provides a huge variety of musical genres to enjoy and a diverse range of gameplay design.
          </p>
          <NuxtLink class="btn btn-secondary mt-4" to="https://play.google.com/store/apps/details?id=me.tigerhix.cytoid" target="_blank">
            <Icon name="mdi:google-play" size="20" />
            <span class="flex-1">
              {{ $t('homepage.download_googleplay') }}
            </span>
          </NuxtLink>
          <NuxtLink class="btn btn-secondary mt-4" to="https://apps.apple.com/us/app/cytoid/id1266582726" target="_blank">
            <Icon name="ion:ios-appstore" size="20" />
            <span class="flex-1">
              {{ $t('homepage.download_appstore') }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <!-- Android: APK -->
      <div
        class="card mb-4 w-full overflow-hidden bg-base-100 shadow-xl"
      >
        <div class="card-body">
          <!-- <h2 class="card-subtitle">
            Download from GitHub
          </h2> -->
          <p>
            You can also download from our GitHub releases page.
          </p>
          <NuxtLink class="btn btn-neutral mt-4" to="https://github.com/Cytoid/Cytoid/releases" target="_blank">
            <Icon name="mdi:github" size="20" />
            <span class="flex-1">

              GitHub Release
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col-span-5 lg:col-span-4">
      <div
        class="card mb-4 w-full overflow-hidden bg-base-100 shadow-xl"
      >
        <div
          class="card card-body bg-primary/25"
        >
          <h2 class="card-subtitle">
            <img src="/images/discord.webp" class="my-2 h-6 px-1">
          </h2>
          <p>
            {{ $t('homepage.connect_discord_content') }}
          </p>
          <NuxtLink to="https://discord.gg/cytoid" class="btn btn-primary mt-4">
            {{ $t('homepage.connect_discord_btn') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
