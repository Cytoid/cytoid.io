<script setup lang="ts">
const props = defineProps({
  mod: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 20,
  },
})
const _mod = props.mod.toLowerCase()
</script>

<template>
  <img
    :src="`/icons/mods/${_mod}.webp`"
    :style="`height: ${size}px; padding-bottom: 2px; max-width: unset; margin-right: 4px;`"
  >
</template>
