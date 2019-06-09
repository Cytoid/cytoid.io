<template lang="pug">
  div
    nav-bar
    nuxt
    footer
</template>

<script>
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
export default {
  components: {
    NavBar,
    Footer,
  },
}
</script>
