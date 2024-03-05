<script setup lang="ts" generic="T extends string | number | symbol">
const props = defineProps<{
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
const ctlPos = ref(0)
onMounted(() => {
  nextTick(() => {
    const { pause, resume } = useRafFn(() => {
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
  <div class="dropdown" :class="{ 'dropdown-open': open }">
    <div
      ref="ctl"
      class="btn btn-neutral flex-nowrap btn-sm"
      @click="open = !open"
    >
      <template v-if="selectedItem">
        <Icon v-if="selectedItem.icon" :name="selectedItem.icon" size="20" />
        {{ selectedItem.label }}
      </template>
      <Icon name="material-symbols:arrow-drop-down" size="20" />
    </div>
    <ul
      ref="box"
      class="dropdown-content z-[1] menu p-2 shadow bg-neutral rounded-box !fixed mt-2"
      :style="`top: ${ctlPos}px`"
    >
      <li
        v-for="item in items"
        :key="item.value"
        :class="{ disabled: item.disabled }"
      >
        <button
          class="flex flex-nowrap break-keep"
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
