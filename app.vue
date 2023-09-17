<script setup lang="ts">
// i18n
await (async () => {
  const { init } = useLocales()
  const headers = process.server
    ? useRequestHeaders(['accept-language'])['accept-language'] ?? ''
    : ''
  await init(headers)
})()

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
  <AlertBox />
  <PreviewPlayer />
  <BetaAlert />
</template>
