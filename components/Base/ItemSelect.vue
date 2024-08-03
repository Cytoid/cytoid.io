<script setup lang="ts">
const props = defineProps<{
  verified: string | null | undefined
  icon: string
  id?: string
}>()
const item = defineModel<string | null>({ required: true })
</script>

<template>
  <div class="form-control">
    <div class="join w-full">
      <label
        v-if="icon"
        :for="props.id"
        class="btn join-item"
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
        class="input join-item input-bordered w-full flex-1"
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
