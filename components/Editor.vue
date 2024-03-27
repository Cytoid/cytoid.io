<script setup lang="ts">
const content = defineModel<string>({ required: false, default: '' })
</script>

<template>
  <ClientOnly>
    <EasyMDE v-bind="$attrs" v-model="content" />
  </ClientOnly>
</template>
