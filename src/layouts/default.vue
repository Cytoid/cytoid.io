<template>
  <div>
    <nav-bar />
    <nuxt />
    <footer-bar />
  </div>
</template>

<script>
import NavBar from './components/NavBar'
import FooterBar from './components/Footer'
export default {
  components: {
    NavBar,
    FooterBar
  }
}
</script>
