<script setup lang="ts">
const { toasts } = useToast()
const onScreenToasts = computed(() => {
  return toasts.value.filter(t => t.state === 'active')
})
const len = computed(() => onScreenToasts.value.length)
function getDisplayState(toast: Toast) {
  if (toast.state === 'hidden') {
    return false
  }
  const index = onScreenToasts.value.findIndex(t => t.id === toast.id) ?? 0
  if (len.value <= 3) {
    return true
  }

  // first two or last one
  return index < 2 || index === len.value - 1
}
</script>

<template>
  <div class="fixed bottom-0 w-screen z-20 overflow-visible">
    <div class="toast-box flex flex-col gap-2 sm:max-w-lg w-full mx-auto p-4">
      <ToastItem
        v-for="toast in onScreenToasts" :key="toast.id"
        :toast="toast"
        :display="getDisplayState(toast)"
        class="[&:nth-child(n+3)]:order-2"
      />

      <div v-show="len > 3" class="badge badge-accent mx-auto select-none">
        + {{ len - 3 }}
      </div>
    </div>
  </div>
</template>
