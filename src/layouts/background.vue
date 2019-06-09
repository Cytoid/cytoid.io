<template lang="pug">
div
  .background-container(v-if="background && background.source")
    .background-wrap(v-parallax.absY="background.parallaxSpeed" :style="{opacity: 1-background.overlayOpacity}")
      img.background-image(v-show="loaded" :src="background.source" @load="animateBackground")
    .background-fade-out
  nav-bar
  nuxt
  footer-bar
</template>

<script>
import FooterBar from '@/components/Footer'
import NavBar from '@/components/NavBar'
import { mapState } from 'vuex'
export default {
  components: {
    FooterBar,
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

<style scoped lang="less">
.background-container {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.background-wrap {
  width: 100%;
  height: 100%;
}

.background-image {
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
.background-fade-out {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50%;
  background-image: linear-gradient(to top, @body-background, rgba(0, 0, 0, 0));
}
</style>
