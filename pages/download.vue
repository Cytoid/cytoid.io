<script setup lang="ts">
const images = [
  ...Array.from({ length: 8 }, (_, i) => `/images/preview/phone_${i + 1}.webp`),
  ...Array.from({ length: 8 }, (_, i) => `/images/preview/tablet_${i + 1}.webp`),
]
useSWR()
resetCytoidPage()
</script>

<template>
  <div class="hero h-[25vh] w-full min-h-[10rem] max-w-md mx-auto sm:max-w-full max-h-[36rem] relative sm:flex">
    <div class="absolute -top-12 sm:top-0 sm:right-0 sm:w-1/2 opacity-50 sm:opacity-100">
      <img src="/images/cryout.webp" class="w-auto h-auto max-w-full max-h-full">
    </div>
    <div class="hero-content h-full w-full">
      <div class="h-full w-full flex flex-col sm:justify-center mr-4">
        <h1 class="text-5xl font-bold flex-1 sm:flex-initial flex items-end">
          <div class="w-full h-full max-h-20">
            <div class="h-full h-16 sm:h-20 max-w-full max-h-full bg-contain bg-no-repeat bg-center sm:bg-left-bottom" style="background-image: url(/images/logo.webp);" />
          </div>
        </h1>
        <p class="py-6 ml-4">
          {{ $t('homepage.slogan') }}
        </p>
      </div>
    </div>
  </div>

  <div class="mt-4 md:grid md:grid-cols-12 md:grid-flow-col md:gap-4">
    <div class="col-span-7 lg:col-span-8 mt-4 md:mt-0">
      <!-- Official -->
      <div
        class="card w-full bg-base-100 shadow-xl overflow-hidden mb-4"
      >
        <div class="card-body card bg-secondary/25">
          <h2 class="card-subtitle">
            Download
          </h2>
          <div class="carousel h-40 space-x-4 rounded-box">
            <div v-for="image of images" :key="image" class="carousel-item">
              <img :src="image" class="rounded-box h-40">
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
            {{ $t('homepage.download_googleplay') }}
          </NuxtLink>
          <NuxtLink class="btn btn-secondary mt-4" to="https://apps.apple.com/us/app/cytoid/id1266582726" target="_blank">
            <Icon name="ion:ios-appstore" size="20" />
            {{ $t('homepage.download_appstore') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Android: APK -->
      <div
        class="card w-full bg-base-100 shadow-xl overflow-hidden mb-4"
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
            GitHub Release
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col-span-5 lg:col-span-4">
      <div
        class="card w-full bg-base-100 shadow-xl overflow-hidden mb-4"
      >
        <div
          class="card-body card bg-primary/25"
        >
          <h2 class="card-subtitle">
            <img src="/images/discord.webp" class="h-6 my-2 px-1">
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
