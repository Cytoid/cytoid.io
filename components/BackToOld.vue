<script setup lang="ts">
defineProps({
  url: {
    type: String,
    required: true,
  },
})
function baseUrl(url: string) {
  return `https://cytoid.io${url}`
}
</script>

<template>
  The page is not finished yet... You can <NuxtLink class="link" :to="baseUrl(url)">
    go back to Cytoid.io
  </NuxtLink>
</template>
