<script setup lang="ts" generic="T extends string | number | symbol">
import type { WritableComputedRef } from 'nuxt/dist/app/compat/vue-demi'

const props = defineProps<{
  modelValue: T
  items: Array<SelectorItem>
  small?: boolean
  onChange?: (value: T) => void
}>()
const emit = defineEmits(['update:modelValue'])
const selected = useVModel(props, 'modelValue', emit) as WritableComputedRef<T>

const items = computed(() => props.items)
const selectedItem = computed(() => {
  return items.value.find(item => item.value === selected.value)
})

const open = ref(false)
const box = ref<HTMLElement>()
onClickOutside(box, () => {
  open.value = false
})

const ctl = ref<HTMLElement>()
const ctlWith = ref(0)
const ctlPos = ref(0)
onMounted(() => {
  nextTick(() => {
    const { pause, resume } = useRafFn(() => {
      ctlWith.value = ctl.value?.offsetWidth ?? 0
      ctlPos.value = ctl.value?.getBoundingClientRect().bottom ?? 0
    })
    pause()
    watch(open, (val) => {
      if (!val) {
        pause()
      }
      else {
        resume()
      }
    })
  })
})

function change(value: T) {
  if (props.onChange) {
    props.onChange(value)
  }
  else {
    selected.value = value
  }
  open.value = false
}

interface SelectorItem {
  icon?: string
  label?: string
  value: T
}
</script>

<template>
  <div class="relative flex flex-col">
    <button
      ref="ctl"
      class="btn btn-neutral flex-nowrap"
      :class="{
        'btn-sm': small,
      }"
      @click="open = !open"
    >
      <template v-if="selectedItem">
        <Icon v-if="selectedItem.icon" :name="selectedItem.icon" size="20" />
        {{ selectedItem.label }}
      </template>
      <Icon name="material-symbols:arrow-drop-down" size="20" />
    </button>
    <div
      v-if="open"
      class="fixed z-10"
      :style="`top: ${ctlPos}px; width: ${ctlWith}px;`"
    >
      <div
        ref="box"
        class="join join-vertical w-full min-w-fit shadow-xl pt-2"
      >
        <button
          v-for="item in items"
          :key="item.value"
          class="btn btn-neutral join-item min-w-fit justify-start flex-nowrap whitespace-nowrap"
          :class="{
            '[:not(:hover)>&]:btn-active': item.value === selected,
            'btn-sm': small,
          }"
          @click="change(item.value)"
        >
          <Icon v-if="item.icon" :name="item.icon" size="20" />
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>
