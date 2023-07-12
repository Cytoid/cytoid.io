<template>
  The page is not finished yet... You can <NuxtLink class="link" :to="baseUrl(url)">go back to Cytoid.io</NuxtLink>
</template>

<script setup>
const props = defineProps({
  url: String
})
const baseUrl = (url) => {
  return `https://cytoid.io${url}`
}
</script>