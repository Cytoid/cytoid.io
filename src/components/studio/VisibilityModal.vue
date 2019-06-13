<template lang="pug">
a-modal(
  title="Change level visibility"
  v-model="modalVisible"
  :closable="false"
)
  a-radio-group(:value="value" size="large")
    a-radio-button(:value="'public'") Public
    a-radio-button(:value="'unlisted'") Unlisted
  div(style="padding-top: 16px;")
    p(v-if="value === 'public'") This level is visible to everybody.
    template(v-else-if="value === 'unlisted'")
      p(style="font-weight: bold;") This level is only visible to anybody who has the link.
      p This level won't appear to viewers who visit the level listing or your profile. It also won't appear in the search results.
      span(style="font-weight: bold;")  However, it is visible in a public collection which contains the level.

</template>

<script>
export default {
  name: 'VisibilityModal',
  data: () => ({
    modalVisible: false,
  }),
  props: {
    value: {
      type: Object,
      required: false,
    },
  },
  watch: {
    value() {
      this.modalVisible = !!this.value
    }
  }
}
</script>

<style scoped>

</style>
