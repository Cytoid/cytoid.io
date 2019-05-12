<template>
  <div>
    <img src="/backgrounds/Kreutz.png" class="background-image">
    <div class="background-overlay"></div>
  </div>
</template>

<script>

</script>

<style scoped>
.background-image {
  width: 100%;
  height: 125%;
  overflow: hidden;
  z-index: -512;
  -webkit-transform: translate3d(0, 0, 0);
  position: absolute;
  object-fit: cover;
  animation: scale-down-center 2s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@-webkit-keyframes scale-down-center {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes scale-down-center {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.background-overlay {
  opacity: 1;
  background: rgba(0, 0, 0, 0.75);
  width: 100%;
  height: 125%;
  z-index: -256;
  -webkit-transform: translate3d(0, 0, 0);
  position: absolute;
  animation: background-overlay 2s 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

@-webkit-keyframes background-overlay {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes background-overlay {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
