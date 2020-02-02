<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-half is-one-third-desktop is-one-quarter-widescreen is-offset-two-thirds-desktop is-offset-three-quarters-widescreen">
          <a-card :bordered="false" class="ele2 session-card" style="width: 100%;">
            <nuxt-child style="position:relative;z-index:1;padding:24px;" />
          </a-card>
        </div>
      </div>
    </div>
  </div>
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
  .session-card .ant-card-body {
    padding: 0;
  }
  .session-card {
    background: linear-gradient(to top, hsla(226, 15%, 19%, 1) 66%, rgba(0,0,0,0)), linear-gradient(to left, #B06AB3, #4568DC);
  }
</style>
