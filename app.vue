<script setup lang="ts">
// auth
onMounted(() => {
  nextTick(async () => {
    if (process.client) {
      const { init } = useAuth()
      await init().catch(() => null)
    }
  })
})

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
