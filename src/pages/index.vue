<template lang="pug">
  div.container.logo
    img(src="/images/logo.png")
</template>

<script>
export default {
  layout: 'background',
  background: {
    source: '/images/normal.png',
    overlayOpacity: 0.1,
  },
}
</script>

<style lang="less">
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
  img {
    max-width: 400px;
  }
}
</style>
