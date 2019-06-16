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
  components: {
    NavBar,
    FooterBar,
  },
}
</script>
