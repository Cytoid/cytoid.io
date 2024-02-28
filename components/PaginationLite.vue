<script setup lang="ts">
const props = withDefaults(defineProps<{
  total: number
  max: number
  disabled: boolean
}>(), {
  max: 6,
  disabled: false,
})

const page = defineModel<number>({ required: true })
const total = computed(() => props.total)

const disabled = computed(() => !!props.disabled)
const isFirstPage = computed(() => page.value === 1)
const isFinalPage = computed(() => page.value === total.value)

const open = ref(false)
const customPage = ref('')
function openJump() {
  customPage.value = page.value.toString()
  open.value = true
}
function jumpToPage() {
  page.value = Number.parseInt(customPage.value) || 1
  open.value = false
  customPage.value = ''
}
</script>

<template>
  <div class="flex">
    <div v-if="!open" class="flex pt-4">
      <div class="flex-1" />
      <div class="join shadow-xl">
        <button class="join-item btn btn-neutral btn-sm" :disabled="isFirstPage || disabled" @click="page = 1">
          <Icon name="ic:round-keyboard-double-arrow-left" />
        </button>
        <button class="join-item btn btn-neutral btn-sm" :disabled="isFirstPage || disabled" @click="page -= 1">
          <Icon name="ic:round-keyboard-arrow-left" />
        </button>
        <button v-if="page" class="join-item btn font-bold btn-sm btn-primary" :disabled="disabled" @click="openJump">
          {{ page }} / {{ total }}
        </button>
        <button class="join-item btn btn-neutral btn-sm" :disabled="isFinalPage || disabled" @click="page += 1">
          <Icon name="ic:round-keyboard-arrow-right" />
        </button>
        <button class="join-item btn btn-neutral btn-sm" :disabled="isFinalPage || disabled" @click="page = total">
          <Icon name="ic:round-keyboard-double-arrow-right" />
        </button>
      </div>
    </div>

    <div v-else class="flex pt-4">
      <div class="join text-base-content w-full flex">
        <button class="join-item btn btn-error btn-sm btn-square" :disabled="disabled" @click="open = false">
          <Icon name="material-symbols:close" size="24" />
        </button>
        <input
          v-model="customPage" type="number" :placeholder="page?.toString()" :min="1" :max="total" class="join-item input input-sm text-center w-20 input-bordered appearance-none"
          @keyup.enter="null"
        >
        <button class="join-item btn btn-neutral w-20 font-bold btn-sm" :disabled="disabled" @click="customPage = total.toString()">
          / {{ total }}
        </button>
        <button class="join-item btn btn-sm btn-primary btn-square" :disabled="disabled || customPage === ''" @click="jumpToPage">
          <Icon name="ic:twotone-keyboard-arrow-right" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>
