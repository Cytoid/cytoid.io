<template>
  <ClientOnly>
    <EasyMDE v-bind="$attrs" v-model="content" />
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const content = useVModel(props, 'modelValue', emit)
</script>