<script setup lang="ts">
const props = defineProps<{
  open?: boolean
  confirm: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'success' | 'error' | 'warning' | 'info'
}>()
const confirmed = ref('')
</script>

<template>
  <ClientOnly>
    <div
      class="modal"
      :class="{
        'modal-open': open,
      }"
    >
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          <slot name="title" />
        </h3>

        <!-- Messages -->
        <slot />

        <input
          v-model="confirmed"
          type="text"
          class="input input-bordered w-full mt-4"
        >
        <div class="modal-action">
          <button class="btn btn-neutral btn-square" @click="onCancel">
            <Icon name="mdi:close" size="18" />
          </button>
          <button
            class="btn flex-1"
            :disabled="confirmed !== props.confirm"
            :class="{
              'btn-success': type === 'success',
              'btn-error': type === 'error',
              'btn-warning': type === 'warning',
              'btn-info': type === 'info',
              'btn-neutral': type === undefined,
            }"
            @click="onConfirm"
          >
            <slot name="buttonContext" />
          </button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
