<template lang="pug">
  .section
    .container
      .columns
        .column.is-half.is-one-third-desktop.is-one-quarter-widescreen(style="margin-left: auto;")
          .box.session-card
            nuxt-child
</template>

<script>
export default {
  layout: 'background',
  background: require('@/assets/images/session.jpg'),
  fetch({ route, redirect }) {
    if (route.fullPath === '/session') {
      redirect({ name: 'session-login' })
    }
  },
}
</script>

<style>
  .session-card {
    background: linear-gradient(to top, hsla(226, 15%, 19%, 1) 66%, rgba(0,0,0,0)), linear-gradient(to left, #B06AB3, #4568DC);
  }
</style>
