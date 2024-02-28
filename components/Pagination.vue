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

const displayedPages = computed<Array<number | '...'>>(() => {
  const total = props.total
  const current = page.value
  const pages = new Set<number>()

  pages.add(1)
  pages.add(current)
  pages.add(total)

  const max = props.max - pages.size

  let addedPrev = current
  let addedNext = current
  for (let i = 0; i < max; i += 1) {
    const can: Array<'prev' | 'next'> = []
    if (addedPrev - 1 > 1) {
      can.push('prev')
    }
    if (addedNext + 1 < total) {
      can.push('next')
    }
    const prefer = i % 2 === 0 ? 'next' : 'prev'
    const direction: 'prev' | 'next' | undefined = can.includes(prefer) ? prefer : can[0]
    if (direction === 'prev') {
      pages.add(addedPrev - 1)
      addedPrev -= 1
    }
    else if (direction === 'next') {
      pages.add(addedNext + 1)
      addedNext += 1
    }
    else {
      break
    }
  }

  const result: Array<number | '...'> = [...pages.values()].sort((a, b) => a - b)

  // push '...' in non-sequential pages
  let last = 1
  for (let i = 0; i < result.length; i += 1) {
    const p = result[i] as number
    if (p - last > 1) {
      result.splice(i, 0, '...')
      i += 1
    }
    last = p
  }

  return result
})

const open = ref(false)
const customPage = ref('')
function onClickPage(p: number) {
  if (p === page.value) {
    openJump()
  }
  else {
    page.value = p
  }
}
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
      <div class="shadow-xl flex content-center items-center gap-2">
        <!-- <button class="btn btn-neutral btn-sm btn-square" :disabled="isFirstPage || disabled" @click="page -= 1">
          <Icon name="ic:round-keyboard-arrow-left" />
        </button> -->
        <template v-for="p in displayedPages" :key="p">
          <button
            v-if="p !== '...'"
            class="btn btn-sm"
            :class="{
              'btn-primary': p === page,
              'btn-neutral': p !== page,
            }"
            :disabled="disabled"
            @click="onClickPage(p)"
            v-text="p"
          />
          <span v-else class="select-none">...</span>
        </template>
        <!-- <button class="btn btn-neutral btn-sm btn-square" :disabled="isFinalPage || disabled" @click="page += 1">
          <Icon name="ic:round-keyboard-arrow-right" />
        </button> -->
        <button class="btn btn-secondary btn-sm btn-circle" :disabled="disabled" @click="openJump">
          <Icon name="uil:enter" />
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
          <Icon name="uil:enter" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>
