<script setup lang="ts">
defineProps<{
  url?: string
}>()
function baseUrl(url: string) {
  return `https://cytoid.io${url}`
}
</script>

<template>
  The page is not ready yet...
  <template v-if="url">
    You can <NuxtLink class="link" :to="baseUrl(url)">
      go back to Cytoid.io
    </NuxtLink>
  </template>
</template>
