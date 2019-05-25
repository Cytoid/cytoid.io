<template>
  <div>
    <div v-parallax.absY="parallaxSpeed" class="background-wrap">
      <img ref="backgroundImage" :src="source" class="background-image">
    </div>
    <div ref="backgroundOverlay" class="background-overlay" />
    <div class="background-fade-out" />
    <div class="background-block" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      parallaxSpeed: 0.2,
      source: '/images/blank.png'
    }
  },
  mounted() {
    this.$root.$on('background', (data) => {
      console.log('received background, source: ' + data.source)
      this.source = data.source
      this.parallaxSpeed = data.parallaxSpeed !== null ? data.parallaxSpeed : 0.2
      this.$refs.backgroundImage.style.animation = 'none'
      this.$refs.backgroundImage.offsetHeight.toString() // Trigger reflow
      this.$refs.backgroundImage.style.animation = null
      this.$refs.backgroundOverlay.style.animation = 'none'
      this.$refs.backgroundOverlay.offsetHeight.toString() // Trigger reflow
      this.$refs.backgroundOverlay.style.animation = null
    })
  }
}
</script>

<style scoped>
.background-wrap {
  position: absolute;
  width: 100%;
  height: 125%;
  z-index: -512;
}

.background-image {
  position: absolute;
  z-index: -512;
  width: 100%;
  height: 100%;
  overflow: hidden;
  object-fit: cover;
  animation: scale-down-center 2s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@keyframes scale-down-center {
  0% {
    opacity: 0;
    transform: scale(1.1);
  }
  60% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.background-overlay {
  opacity: 1;
  background: hsla(226, 68%, 2%, 0.4);
  width: 100%;
  height: 125%;
  z-index: -256;
  position: absolute;
  animation: background-overlay 1.6s 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@keyframes background-overlay {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.background-fade-out {
  position: absolute;
  bottom: -25%;
  width: 100%;
  height: 25%;
  z-index: -128;
  background-image: linear-gradient(to top, hsla(226, 68%, 6%, 1), rgba(0, 0, 0, 0));
}

.background-block {
  position: absolute;
  top: 125%;
  width: 100%;
  height: 50%;
  z-index: -64;
  background: hsla(226, 68%, 6%, 1);
}
</style>
