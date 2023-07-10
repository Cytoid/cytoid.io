<template>
  <div class="w-full h-full">
    <NuxtLayout>
      <NuxtLoadingIndicator color="#9CAFEC" />
      <NuxtPage />
    </NuxtLayout>
  </div>
  <!-- <AlertBox /> -->
</template>

<script setup lang="ts">
// i18n
(async () => {
  const { init } = useLocales()
  if (process.client) {
    init()
  }
})();

// auth
(async () => {
  const { ready, init } = useAuth()
  if (process.client && !ready.value) {
    await wait() // Idk but the next line will always return null if I don't wait a millisecond
    const user = await init()
    if (user) {
      console.log(`Welcome back, ${user.name}!`)
    } else {
      console.log('Not logged in')
    }
  }
})();

</script>