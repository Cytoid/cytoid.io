<script setup lang="ts">
const ctdApp = useCytoidPage()
watchEffect(() => {
  // do some thing when ctdApp changed
})
</script>

<template>
  <!-- Background -->
  <div v-if="ctdApp.background !== ''" class="relative h-0">
    <div class="absolute top-0 size-full select-none" style="z-index: -1;">
      <div class="relative h-screen w-full lg:max-h-[100vw]">
        <div class="size-full bg-cover bg-center brightness-75" :style="`background-image: url(&quot;${ctdApp.background}&quot;)`" />
        <div class="absolute top-0 h-32 w-full bg-gradient-to-b from-base-100/60 to-base-100/0" />
        <div class="absolute bottom-0 h-2/3 w-full bg-gradient-to-b from-base-100/0 to-base-100" />
      </div>
    </div>
  </div>

  <!-- Layout -->
  <div class="mx-auto flex min-h-screen flex-col items-center overflow-auto">
    <div class="z-10 w-full">
      <NavBar />
    </div>
    <div class="w-full max-w-screen-2xl flex-1">
      <div class="p-4 lg:px-12">
        <slot />
      </div>
    </div>
    <div class="w-full">
      <Footer />
    </div>
  </div>
</template>
