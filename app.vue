<script setup lang="ts">
useHead({
  titleTemplate(title) {
    return title || 'Cytoid'
  },
  link: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ],
})
</script>

<template>
  <div class="w-full h-full">
    <NuxtLayout>
      <VitePwaManifest />

      <NuxtLoadingIndicator color="#9CAFEC" />
      <NuxtPage />
      <slot />
    </NuxtLayout>
  </div>
  <ToastBox />
  <PreviewPlayer />
</template>
