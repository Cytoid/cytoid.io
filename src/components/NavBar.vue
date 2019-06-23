<template lang="pug">
header.navbar.light.container(role="navigation")
  nuxt-link.navbar-item(:to="{ name: 'index' }" exact) Cytoid
  nuxt-link.navbar-item(:to="{ name: 'levels' }") Levels
  search.left
  no-ssr
    nuxt-link(v-if="!$store.state.user" to="/session/login"): a-button(type="primary") Login
    a-popover.navbar-popover(v-else placement="bottomRight" trigger="click")
      a-avatar(:src="$store.state.avatar")
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
    color: $grey-lighter;
    padding: 0 1rem;
    &:hover {
      color: $white-bis;
    }
    &.is-active {
      color: $white;
    }
  }
}
</style>
