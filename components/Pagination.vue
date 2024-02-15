<script setup lang="ts">
const props = defineProps<{
  toFirstPage: () => void
  toPrevPage: () => void
  toNextPage: () => void
  toFinalPage: () => void
  page: number
  totalPage: number

  jumpToPage: (page: number) => void

  isFirstPage?: boolean
  isFinalPage?: boolean

  disabled?: boolean
}>()

const _isFirstPage = computed(() => {
  if (props.isFirstPage) {
    return props.isFirstPage
  }
  if (props.page !== undefined && props.totalPage !== undefined) {
    return props.page === 1
  }
  return false
})

const _isFinalPage = computed(() => {
  if (props.isFinalPage) {
    return props.isFinalPage
  }
  if (props.page !== undefined && props.totalPage !== undefined) {
    return props.page === props.totalPage
  }
  return false
})

const open = ref(false)
const customPage = ref('')
function _jumpToPage() {
  const _customPage = Number.parseInt(customPage.value) || 1
  props.jumpToPage(_customPage)
  open.value = false
  customPage.value = ''
}
</script>

<template>
  <div class="flex">
    <div v-if="!open" class="flex pt-4">
      <div class="flex-1" />
      <div class="join shadow-xl">
        <button v-if="toFirstPage" class="join-item btn btn-neutral btn-sm" :disabled="_isFirstPage || disabled" @click="toFirstPage">
          <Icon name="ic:round-keyboard-double-arrow-left" />
        </button>
        <button v-if="toPrevPage" class="join-item btn btn-neutral btn-sm" :disabled="_isFirstPage || disabled" @click="toPrevPage">
          <Icon name="ic:round-keyboard-arrow-left" />
        </button>
        <button v-if="page" class="join-item btn font-bold btn-sm btn-primary" :disabled="disabled" @click="open = (jumpToPage != null)">
          {{ page }}
          <template v-if="totalPage">
            / {{ totalPage }}
          </template>
        </button>
        <button v-if="toNextPage" class="join-item btn btn-neutral btn-sm" :disabled="_isFinalPage || disabled" @click="toNextPage">
          <Icon name="ic:round-keyboard-arrow-right" />
        </button>
        <button v-if="toFinalPage" class="join-item btn btn-neutral btn-sm" :disabled="_isFinalPage || disabled" @click="toFinalPage">
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
          v-model="customPage" type="number" :placeholder="page?.toString()" :min="1" :max="totalPage" class="join-item input input-sm text-center w-20 input-bordered appearance-none"
          @keyup.enter="null"
        >
        <button v-if="totalPage" class="join-item btn btn-neutral w-20 font-bold btn-sm" :disabled="disabled" @click="customPage = totalPage.toString()">
          / {{ totalPage }}
        </button>
        <button class="join-item btn btn-sm btn-primary btn-square" :disabled="disabled || customPage === ''" @click="_jumpToPage">
          <Icon name="ic:twotone-keyboard-arrow-right" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>
