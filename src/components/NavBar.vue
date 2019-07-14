<template lang="pug">
header.navbar.light.container(role="navigation")
  nuxt-link.navbar-item(:to="{ name: 'index' }" exact) Home
  nuxt-link.navbar-item(:to="{ name: 'levels' }") Levels
  a.navbar-item(href='https://sites.google.com/site/cytoidcommunity' target="_blank") Wiki
  search.left
  no-ssr
    nuxt-link(v-if="!$store.state.user" to="/session/login"): a-button(type="primary") Login
    a-popover.navbar-popover(v-else placement="bottomRight" trigger="click")
      a-avatar(:src="$store.state.avatar").avatar-icon
      nav-card(slot="content")
</template>

<script>
import Search from './SearchInput'
import NavCard from './NavCard'
export default {
  components: {
    Search,
    NavCard,
  },
}
</script>

<style lang="scss">
.navbar {
  height: 3rem;
  display: flex;
  align-items: center;
  padding: 0.25rem 1rem;
  .left {
    margin-left: auto;
  }
  .search-input {
    margin-right: 1rem;
  }
  .navbar-item {
    color: rgba(255, 255, 255, 0.5);
    padding: 0 1rem;
    &:hover {
      color: rgba(255, 255, 255, 1);
    }
    &.is-active {
      color: rgba(255, 255, 255, 1);
      font-weight: bold;
    }
  }
  .avatar-icon {
    cursor: pointer;
  }
}
</style>
