<script setup lang="ts">
const props = defineProps<{
  name?: string
  value: string
  verified?: boolean | null
  removeItem?: (val: string) => void
}>()

const [DefineItemContentBody, ItemContentBody] = createReusableTemplate()

const stateInfo = computed(() => {
  if (props.verified === false) {
    return '[Not Found]'
  }
  if (props.verified === null) {
    return '[Loading]'
  }
  return ''
})

const hasName = computed(() => {
  return !!props.name
})

const name = computed(() => {
  return props.name ?? props.value
})

function remove() {
  if (props.removeItem) {
    props.removeItem(props.value)
  }
}
</script>

<template>
  <DefineItemContentBody>
    <div
      class="badge badge-neutral badge-lg m-1 pr-1"
      :class="{
        'bg-error/25': verified === false,
        'bg-success/25': verified === true,
        'bg-warning/25': verified === null,
      }"
    >
      {{ stateInfo }} {{ name }}
      <button class="btn btn-circle btn-ghost btn-xs ml-1" :disabled="removeItem === undefined" @click="remove">
        <Icon name="mdi:close" size="16" />
      </button>
    </div>
  </DefineItemContentBody>

  <div v-if="hasName" class="tooltip" :data-tip="value">
    <ItemContentBody />
  </div>
  <ItemContentBody v-else />
</template>
