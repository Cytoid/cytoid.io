<script setup lang="ts">
const props = defineProps<{
  name: string
  value: string
  verified?: boolean | null
  removeItem?: (val: string) => void
}>()

const stateInfo = computed(() => {
  if (props.verified === false) {
    return '[Not Found]'
  }
  if (props.verified === null) {
    return '[Loading]'
  }
  return ''
})

function remove() {
  if (props.removeItem) {
    props.removeItem(props.value)
  }
}
</script>

<template>
  <div
    class="badge badge-lg m-1 pr-1"
    :class="{
      'badge-neutral': verified === undefined,
      'badge-error': verified === false,
      'badge-success': verified === true,
      'badge-warning': verified === null,
    }"
  >
    {{ stateInfo }} {{ name }}
    <button class="btn btn-ghost btn-xs btn-circle ml-1" :disabled="removeItem === undefined" @click="remove">
      <Icon name="mdi:close" size="16" />
    </button>
  </div>
</template>
