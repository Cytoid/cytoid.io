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
  <div :class="`w-min max-w-xs diff-badge rounded-full diff-badge-${_type} tooltip tooltip-primary`" :data-tip="notesCount ? `${notesCount} notes` : ``">
    <div class="diff-badge-body flex items-center justify-center px-5 py-2">
      <div>
        <span class="diff-badge-lv">Lv.</span>{{ _difficulty }}
      </div>
      <span class="diff-badge-name ml-2 truncate">{{ _name }}</span>
    </div>
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
