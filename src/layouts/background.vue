<template>
  <div>
    <div id="background-container">
      <img src="~assets/background.png">
      <div id="background-fadein" />
    </div>
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

<style lang="scss">
#background-container {
  overflow: hidden;
  z-index: -128;
  height: 100%;
  width: 100%;
  position: absolute;
  #background-fadein {
    position: absolute;
    bottom: -25%;
    width: 100%;
    height: 75%;
    background: linear-gradient(to top, $dark, rgba(0, 0, 0, 0));
  }
}

</style>
