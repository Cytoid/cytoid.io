<template lang="pug">
  .section
    .container
      .columns
        .column.is-half.is-offset-half.is-one-third-desktop.is-one-quarter-widescreen.is-offset-two-thirds-desktop.is-offset-three-quarters-widescreen
          .box.session-card
            nuxt-child
</template>

<script>
export default {
  layout: 'background',
  background: require('@/assets/images/session.jpg'),
  fetch({ route, redirect }) {
    if (route.fullPath === '/session') {
      redirect('/session/login')
    }
  },
}
</script>

<style lang="less">
  .session-card {
    background: linear-gradient(to top, hsla(226, 15%, 19%, 1) 66%, rgba(0,0,0,0)), linear-gradient(to left, #B06AB3, #4568DC);
    padding: 1.5rem;
  }
</style>
