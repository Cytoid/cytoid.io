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
  trim: {
    type: Boolean,
    default: false,
  },
})

const _type = computed(() => props.type.toLowerCase())
const _name = computed(() => {
  if (props.name) {
    return props.name
  }
  if (props.trim) {
    if (_type.value === 'extreme') {
      return 'EX'
    }
    if (_type.value === 'hard') {
      return 'HD'
    }
    if (_type.value === 'easy') {
      return 'EZ'
    }
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
  <div :class="`tooltip tooltip-primary flex max-h-8 badge diff-badge-${_type} space-x-2`" :data-tip="notesCount ? `${notesCount} notes` : ``">
    <span class="truncate">
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
