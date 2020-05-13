<template lang="pug">
div
  .background-container(
    v-if="background && background.source"
    v-parallax.absY="background.parallaxSpeed"
  )
    img.background-image(
      v-show="loaded"
      :class="{landing: background.landing}"
      :style="{filter: background.landing ? `none` : `brightness(${1 - this.background.overlayOpacity})` }"
      :src="background.source"
      @load="animateBackground"
    )
    .background-fade-out
  layout
</template>

<script>
import { mapState } from 'vuex'
import Layout from './default'

export default {
  components: {
    Layout,
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

<style lang="scss">
.background-container {
  position: absolute;
  width: 100%;
  z-index: 0;
  overflow: hidden;
  transition: 0.4s $hoverEasing;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-image {
  width: 100%;
  min-height: 80vh;
  max-height: 100vh;
  animation: scale-down-center 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
  object-fit: cover;
  &.landing {
    margin-top: 80px;
  }
}

@media (min-width: 768px) {
  .background-image.landing {
    min-height: unset;
    max-height: unset;
    width: 640px;
    margin-left: 420px;
    margin-top: 80px;
  }
}

@media (min-width: 992px) {
  .background-image.landing {
    min-height: unset;
    max-height: unset;
    width: 740px;
    margin-left: 460px;
    margin-top: 60px;
  }
}

@media (min-width: 1200px) {
  .background-image.landing {
    min-height: unset;
    max-height: unset;
    width: 880px;
    margin-left: 520px;
    margin-top: 40px;
  }
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
  background-image: linear-gradient(to top, $body-background-color, rgba(0, 0, 0, 0));
}
</style>
