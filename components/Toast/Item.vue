<script setup lang="ts">
const props = defineProps<{
  display: boolean
  toast: Toast
}>()

const progress = ref<null | number>(null)

const { closeToast } = useToast()

if (props.toast.timeout !== 0) {
  const { passed, pause, resume, delay } = useTimer()

  watchEffect(() => {
    progress.value = passed.value / props.toast.timeout
    if (progress.value > 1) {
      close(false)
    }
  })

  watch(() => props.display, (val, oldVal) => {
    if (val) {
      resume()
      if (oldVal === false) {
        // show at least 3s
        const remained = (1 - (progress.value ?? 1)) * props.toast.timeout
        if (remained < 3000) {
          delay(3000 - remained)
        }
      }
    }
    else {
      pause()
    }
  })
}

const toastClass = computed(() => {
  return {
    success: 'bg-success text-success-content',
    error: 'bg-error text-error-content',
    warning: 'bg-warning text-warning-content',
    info: 'bg-info text-info-content',
    none: 'bg-neutral text-neutral-content',
  }[props.toast.type]
})

const progressClass = computed(() => {
  return {
    success: 'bg-success-content',
    error: 'bg-error-content',
    warning: 'bg-warning-content',
    info: 'bg-info-content',
    none: 'bg-neutral-content',
  }[props.toast.type]
})

function close(clicked: boolean) {
  if (clicked) {
    props.toast.onClick?.()
  }
  closeToast(props.toast.id)
}
</script>

<template>
  <div
    v-if="display" class="toast-item relative rounded-2xl shadow-md overflow-hidden"
    :class="[toastClass, toast.onClick && 'cursor-pointer']"
    @click="toast.onClick ? close(true) : undefined"
  >
    <div class="flex items-center gap-4 p-4">
      <Icon :name="toast.icon" size="24" />
      <div v-if="toast.description">
        <h3 class="font-bold">
          {{ toast.message }}
        </h3>
        <div class="text-xs">
          {{ toast.description }}
        </div>
      </div>
      <span v-else class="flex-1 break-words overflow-x-hidden"> {{ toast.message }} </span>

      <button class="btn btn-sm btn-ghost btn-circle" @click.stop="close(false)">
        <Icon name="mdi:close" size="24" />
      </button>
    </div>

    <div
      class="absolute bottom-0 left-0 h-1 opacity-50"
      :class="progressClass"
      :style="`width: ${(1 - (progress ?? 0)) * 100}%`"
    />
  </div>
</template>

<style>
@keyframes jitter {
  0%, 100% {
    transform: translateX(0);
  }
  25%, 75% {
    transform: translateX(-1%);
  }
  50% {
    transform: translateX(1%);
  }
}

.toast-item:nth-last-child(2) {
  animation: jitter 0.3s ease-in-out;
}
</style>
