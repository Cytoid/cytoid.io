<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'info',
  },
  icon: {
    type: String,
    default: 'material-symbols:error-circle-rounded-outline',
  },
  message: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    default: null,
  },
  delay: {
    type: Number,
    default: 3,
  },
})

const dialog = ref(false)
const show = ref(true)

onMounted(() => {
  setTimeout(() => {
    show.value = false
  }, props.delay * 1000)
})
</script>

<template>
  <!-- TODO: translate -->
  <div
    v-show="show" class="alert shadow-lg w-fit h-12 mx-auto my-2 flex transition-opacity duration-500 pointer-events-auto" :class="{
      'alert-success': type === 'success',
      'alert-error': type === 'error',
      'alert-warning': type === 'warning',
      'alert-info': type === 'info',
    }"
  >
    <Icon :name="icon" size="24" />
    <span> {{ message }} </span>
    <div v-if="details" class="flex-none">
      <button class="btn btn-sm btn-circle btn-ghost" @click="dialog = true">
        <Icon name="mdi:chevron-right" size="24" />
      </button>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="details">
      <div
        class="modal" :class="{
          'modal-active': dialog,
        }"
      >
        <div class="modal-box">
          <h3 class="font-bold text-lg">
            {{ message }}
          </h3>
          <p class="py-4">
            {{ details }}
          </p>
          <div class="modal-action flex">
            <!-- <button class="btn btn-ghost" @click="">
              Copy
            </button> -->
            <div class="flex-1" />
            <button class="btn" @click="dialog = false">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
