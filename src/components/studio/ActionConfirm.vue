<template>
  <div class="action-confirm">
    <b-input v-model="userInput" :placeholder="value" />
    <b-button
      expanded
      :disabled="userInput !== value"
      :loading="loading"
      :type="buttonType"
      @click="$emit('click', $event)"
    >
      {{ buttonTitle }}
    </b-button>
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
      default: 'is-primary',
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

<style lang="scss">
.action-confirm {
  margin-top: 1rem;
  .control {
    margin-bottom: 0.5rem;
    .input {
      text-align: center;
    }
  }
}
</style>
