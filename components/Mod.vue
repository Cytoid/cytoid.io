<script setup lang="ts">
const props = defineProps({
  mod: {
    type: String,
    required: true,
  },
})
const _mod = props.mod.toLowerCase()
</script>

<template>
  <img :src="`/icons/mods/${_mod}.webp`" style="height: 20px; padding-bottom: 2px; max-width: unset; margin-right: 4px;">
</template>
