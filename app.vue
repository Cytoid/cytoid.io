<script setup lang="ts">
// i18n
(() => {
  if (process.server) {
    const { init } = useLocales()
    const headers = useRequestHeaders(['accept-language'])
    init(headers['accept-language'] ?? '')
  }
})();

// auth
(async () => {
  if (process.client) {
    const { init } = useAuth()
    await wait() // Idk but the next line will always return null if I don't wait a millisecond
    await init().catch(() => null)
  }
})()

useHead({
  titleTemplate(title) {
    return title ? `${title} - Cytoid` : 'Cytoid'
  },
})
</script>

<template>
  <div class="w-full h-full">
    <NuxtLayout>
      <NuxtLoadingIndicator color="#9CAFEC" />
      <NuxtPage />
      <slot />
    </NuxtLayout>
  </div>
  <AlertBox />
</template>
