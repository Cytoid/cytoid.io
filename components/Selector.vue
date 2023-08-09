<script setup lang="ts" generic="T extends string | number | symbol">
import type { WritableComputedRef } from 'nuxt/dist/app/compat/vue-demi'

const props = defineProps<{
  modelValue: T
  items: Array<SelectorItem>
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

function change(value: T) {
  selected.value = value
  open.value = false
}

interface SelectorItem {
  icon?: string
  label?: string
  value: T
}
</script>

<template>
  <div class="relative z-10 flex flex-col">
    <button
      class="btn btn-neutral"
      @click="open = !open"
    >
      <template v-if="selectedItem">
        <Icon v-if="selectedItem.icon" :name="selectedItem.icon" size="20" />
        {{ selectedItem.label }}
      </template>
      <Icon name="material-symbols:arrow-drop-down" size="20" />
    </button>
    <div v-show="open" class="absolute -bottom-2 h-0 w-full">
      <div
        ref="box"
        class="join join-vertical w-full shadow-xl"
      >
        <button
          v-for="item in items"
          :key="item.value"
          class="btn btn-neutral join-item justify-start"
          :class="{
            '[:not(:hover)>&]:btn-active': item.value === selected,
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
