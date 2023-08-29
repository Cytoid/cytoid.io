<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null
  verified: string | null | undefined
  icon: string
  id?: string
}>()
const emit = defineEmits(['update:modelValue'])
const item = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="form-control">
    <div class="join w-full">
      <label
        v-if="icon"
        :for="props.id"
        class="join-item btn"
        :class="{
          'btn-neutral': !item,
          'btn-success': item && (verified || verified === ''),
          'btn-error': item && verified === null,
          'btn-warning': item && verified === undefined,
        }"
      >
        <Icon :name="icon" size="20" />
      </label>
      <input
        :id="props.id"
        v-model="item" type="text"
        class="join-item input input-bordered flex-1 w-full"
      >
    </div>
    <label v-if="item" class="label">
      <span v-if="verified === null" class="label-text-alt">
        {{ item }} not found
      </span>
      <span v-else-if="verified === undefined" class="label-text-alt">
        loading...
      </span>
      <span v-else class="label-text-alt">
        Selected: {{ verified }}
      </span>
    </label>
  </div>
</template>
