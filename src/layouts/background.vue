<template lang="pug">
div
  div(style="z-index: 0;")
    .background-wrap(v-if="background && background.source" v-parallax.absY="background.parallaxSpeed")
      img.background-image(v-show="loaded" :src="background.source" @load="animateBackground")
    .background-overlay(v-show="loaded" :style="{ background: `hsla(226, 68%, 2%, ${this.background.overlayOpacity})` }")
    .background-fade-out
    .background-block
  nav-bar
  nuxt
  footer
</template>

<script>
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { mapState } from 'vuex'
export default {
  components: {
    Footer,
    NavBar
  },
  data: () => ({
    loaded: false,
  }),
  computed: {
    ...mapState([
      'background',
    ]),
  },
  watch: {
    'background.source'() {
      this.loaded = false
    }
  },
  methods: {
    animateBackground() {
      this.loaded = true
    }
  }
}
</script>

<style scoped>
.background-wrap {
  position: absolute;
  width: 100%;
  height: 125%;
}

.background-image {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  animation: scale-down-center 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@keyframes scale-down-center {
  0% {
    opacity: 0;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.background-overlay {
  opacity: 1;
  background: hsla(226, 68%, 2%, 0.5);
  width: 100%;
  top: -25%;
  height: 150%;
  z-index: 0;
  position: absolute;
  animation: background-overlay 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@keyframes background-overlay {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.8;
  }
}

.background-fade-out {
  position: absolute;
  bottom: -25%;
  width: 100%;
  height: 50%;
  z-index: 0;
  background-image: linear-gradient(to top, hsla(226, 68%, 6%, 1), rgba(0, 0, 0, 0));
}

.background-block {
  position: absolute;
  top: 125%;
  width: 100%;
  height: 50%;
  z-index: 0;
  background: hsla(226, 68%, 6%, 1);
}
</style>
