<template lang="pug">
a-select(
  :value="[false, null, true].indexOf(this.value)"
  @change="change"
  :class="{ 'is-no-border': !bordered }"
)
  a-select-option(
    v-for="(mode, index) of ['visibility_status_private', 'visibility_status_unlisted', 'visibility_status_public']"
    :key="index"
    :value="index"
  )
    font-awesome-icon(:icon="['lock', 'eye-slash', 'globe'][index]" fixed-width style="margin-right: 4px;")
    span(v-t="mode")
</template>

<script>
export default {
  name: 'VisibilitySelect',
  props: {
    value: {
      type: Boolean,
      required: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    change(num) {
      this.$emit('change', [false, null, true][num])
    }
  },
  i18n: {
    key: 'studio'
  }
}
</script>

<style scoped>

</style>
