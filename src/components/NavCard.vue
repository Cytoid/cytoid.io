<template lang="pug">
.navcard
  avatar.navcard-avatar(:src="$store.state.avatar")
  img.navcard-header(:src="$img(headerURL, { height: 128 })")
  .navcard-grid
    nuxt-link.navcard-item(:to="{ name: 'profile-id', params: { id: $store.state.user.uid || $store.state.user.id } }")
      font-awesome-icon.icon(:icon="['far', 'user']")
      .title Profile
    nuxt-link.navcard-item(to="/studio")
      font-awesome-icon.icon(:icon="['far', 'puzzle-piece']")
      .title My Content
    .navcard-item
      font-awesome-icon.icon(:icon="['far', 'heart']")
      .title Favorites
    nuxt-link.navcard-item(to="/settings")
      font-awesome-icon.icon(:icon="['far', 'cog']")
      .title Settings
  .section
    a-button(type="danger" block @click="logout") Sign Out
</template>

<script>
export default {
  name: 'NavCard',
  data() {
    return {
      headerURL: null,
    }
  },
  mounted() {
    const headerURL = window.localStorage.getItem('profile:header')
    if (headerURL) {
      this.headerURL = headerURL
      return
    }
    this.$axios.get('/profile/' + this.$store.state.user.id)
      .then((res) => {
        console.log(res.data)
        this.headerURL = res.data.headerURL
        window.localStorage.setItem('profile:header', this.headerURL)
      })
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => this.$router.go(0))
    }
  }
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
