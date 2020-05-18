<template lang="pug">
  div
    nav-bar
    nuxt
    footer-bar
</template>

<script>
import FooterBar from '@/components/Footer'
import NavBar from '@/components/NavBar'
export default {
  name: 'DefaultLayout',
  components: {
    NavBar,
    FooterBar,
  },
  head() {
    return {
      htmlAttrs: {
        lang: this.$store.state.locale,
      }
    }
  }
}
</script>
