<template lang="pug">
  .section: .container.has-text-centered
    h1(v-text="message")
    nuxt-link(to="/")
</template>

<script>
export default {
  name: 'ErrorLayout',
  layout: 'default',
  props: {
    error: {
      type: Object,
      required: true,
    }
  },
  computed: {
    message () {
      if (!this.error) {
        return null
      }
      return this.error.message
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: this.$store.state.locale,
      }
    }
  }
}
</script>
