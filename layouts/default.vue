<script setup lang="ts">
const ctdApp = useCytoidPage()
watchEffect(() => {
  // do some thing when ctdApp changed
})
</script>

<template>
  <!-- Background -->
  <div v-if="ctdApp.background !== ''" class="absolute select-none w-full h-full top-0" style="z-index: -1;">
    <div class="w-full h-screen sm:max-h-[100vw]">
      <img
        class="absolute w-full h-full bg-center bg-cover brightness-75"
        :style="`background-image: url(&quot;${ctdApp.background}&quot;)`"
      >
      <div class="absolute top-0 h-32 w-full bg-gradient-to-b from-base-100/60 to-base-100/0" />
      <div class="absolute bottom-0 h-2/3 w-full bg-gradient-to-b from-base-100/0 to-base-100" />
    </div>
  </div>

  <!-- Layout -->
  <div class="min-h-screen flex flex-col items-center mx-auto overflow-auto">
    <div class="w-full z-10">
      <NavBar />
    </div>
    <div class="flex-1 w-full max-w-screen-2xl">
      <div class="py-4 px-4 lg:px-12">
        <slot />
      </div>
    </div>
    <div class="w-full">
      <Footer />
    </div>
  </div>
</template>
