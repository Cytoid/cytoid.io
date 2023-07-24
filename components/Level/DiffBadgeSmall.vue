<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  notesCount: {
    type: Number,
    default: null,
  },
})

const _type = computed(() => props.type.toLowerCase())
const _name = computed(() => {
  if (props.name) {
    return props.name
  }
  return _type.value.charAt(0).toUpperCase() + _type.value.slice(1)
})
const _difficulty = computed(() => {
  if (props.difficulty <= 0) {
    return '?'
  }
  else if (props.difficulty > 15) {
    return '15+'
  }
  else {
    return props.difficulty.toString()
  }
})
</script>

<template>
  <div :class="`tooltip tooltip-primary flex h-8 badge badge-lg diff-badge-${_type} space-x-2`" :data-tip="notesCount ? `${notesCount} notes` : ``">
    <span>
      {{ _name }}
    </span>
    <span>
      {{ _difficulty }}
    </span>
  </div>
</template>

<style scoped>
.hide-lv .diff-badge-lv {
  display: none;
}
.hide-name .diff-badge-name {
  display: none;
}
</style>
