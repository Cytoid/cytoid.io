<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  to: RouteLocationRaw
}>()
const router = useRouter()

function openInNewTab() {
  const url = router.resolve(props.to).href
  if (process.client) {
    window.open(url)
  }
}
</script>

<template>
  <button @click.prevent.stop="router.push(to)" @auxclick.prevent.stop="openInNewTab">
    <slot />
  </button>
</template>
