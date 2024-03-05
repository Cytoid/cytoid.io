<script setup lang="ts" generic="T extends string | number | symbol">
const props = defineProps<{
  modelValue: T
  items: Array<SelectorItem>
  onChange?: (value: T) => void
}>()
const selected = defineModel<T>()

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
  disabled?: boolean
}
</script>

<template>
  <div class="dropdown z-[1]">
    <div
      tabindex="0"
      role="button"
      class="btn btn-neutral flex-nowrap"
    >
      <template v-if="selectedItem">
        <Icon v-if="selectedItem.icon" :name="selectedItem.icon" size="20" />
        {{ selectedItem.label }}
      </template>
      <Icon name="material-symbols:arrow-drop-down" size="20" />
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu p-2 shadow bg-neutral rounded-box mt-2"
    >
      <li
        v-for="item in items"
        :key="item.value"
        :class="{ disabled: item.disabled }"
      >
        <button
          class="flex flex-nowrap whitespace-nowrap"
          :class="{ '[:not(:hover)>li>&]:focus': item.value === selected }"
          :disabled="item.disabled"
          @click="change(item.value)"
        >
          <Icon v-if="item.icon" :name="item.icon" size="20" />
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>
