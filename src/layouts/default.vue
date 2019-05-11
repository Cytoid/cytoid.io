<template lang="pug">

  div
    header.cy-navbar
      cy-menu
        cy-menu-link-item(to="/" exact) Home
        cy-menu-link-item(to="/levels") Levels
      .cy-navbar-end
        a-popover(
          trigger="click"
          v-model="userPopoverVisible"
          placement="bottomLeft"
        )
          div(slot="content") This is the content
          a-button(type="primary" shape="circle" icon="user")
    nuxt
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      userPopoverVisible: false,
    }
  }
}
</script>

<style lang="less">
.cy-navbar {
  ul.ant-menu-root {
    margin-top: 0;
    margin-bottom: 0;
  }
  display: flex;
  .cy-navbar-end {
    justify-content: flex-end;
    flex-grow: 3;
    display: flex;
    align-items: center;
    padding-right: 2rem;
  }
}
</style>
