<template lang="pug">
.navcard
  img.navcard-avatar(src="https://www.gravatar.com/avatar/32f47f0c1d23f9f584e3aa23db920a6f")
  img.navcard-header(src="/images/normal.png")
  .navcard-grid
    nuxt-link.navcard-item(to="/profile/neo")
      font-awesome-icon.icon(:icon="['far', 'user']")
      .title Profile
    nuxt-link.navcard-item(to="/me")
      font-awesome-icon.icon(:icon="['far', 'puzzle-piece']")
      .title My Content
    .navcard-item
      font-awesome-icon.icon(:icon="['far', 'heart']")
      .title Favorites
    .navcard-item
      font-awesome-icon.icon(:icon="['far', 'cog']")
      .title Settings
  .section
    a-button(type="danger" block @click="$auth.logout()") Sign Out
</template>

<script>
export default {
  name: 'NavCard',
}
</script>

<style lang="less">
@header-height: 128px;
@icon-size: 2rem;
@avatar-size: 96px;
.navcard {
  background-color: @component-background;
  width: 80vw;
  max-width: 330px;
  position: relative;
  .navcard-header {
    width: 100%;
    height: @header-height;
    margin-bottom: @avatar-size / 2;
    object-fit: cover;
    object-position: center;
  }
  .navcard-avatar {
    position: absolute;
    width: @avatar-size;
    height: @avatar-size;
    border-radius: @avatar-size / 2;
    left: calc(50% - @avatar-size / 2);
    top: @header-height - @avatar-size / 2;
  }
  .navcard-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 16px 0;
    .navcard-item {
      padding: 32px;
      border-radius: 2px;
      color: white;
      &:hover {
        background-color: @item-hover-bg;
      }
      .icon {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: @icon-size;
        height: @icon-size;
      }
      .title {
        text-align: center;
        margin-top: 0.5rem;
      }
    }
  }
}
</style>

<style>
.ant-popover-inner {
  overflow: hidden;
}
.ant-popover-inner-content {
  padding: 0;
}
</style>
