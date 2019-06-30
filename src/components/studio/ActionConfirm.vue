<template>
  <div class="action-confirm">
    <a-input v-model="userInput" :placeholder="value" />
    <a-button
      block
      :disabled="userInput !== value"
      :loading="loading"
      :type="buttonType"
      @click="$emit('click', $event)"
    >
      {{ buttonTitle }}
    </a-button>
  </div>
</template>

<script>
export default {
  name: 'ActionConfirm',
  props: {
    buttonTitle: {
      type: String,
      default: 'Confirm',
    },
    buttonType: {
      type: String,
      default: 'primary',
    },
    value: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    userInput: null,
  }),
}
</script>

<style>
.action-confirm .ant-input {
  margin-bottom: 0.5rem;
  text-align: center;
}
</style>
