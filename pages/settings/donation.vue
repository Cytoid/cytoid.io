<script setup lang="ts">
const route = useRoute()
defineCytoidPage({
  title: 'WIP',
})
</script>

<template>
  <BackToOld :url="route.path" />
</template>
