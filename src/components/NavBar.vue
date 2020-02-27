<template lang="pug">
header.navbar.light.container(role="navigation")
  nuxt-link.navbar-item(:to="{ name: 'index' }" exact) {{$t('nav_home')}}
  nuxt-link.navbar-item(:to="{ name: 'levels' }") {{$t('nav_levels')}}
  a.navbar-item(href='https://sites.google.com/site/cytoidcommunity' target="_blank" v-t="'nav_wiki'")
  client-only
    search.left
    nuxt-link(v-if="!$store.state.user" to="/session/login"): a-button(type="primary") {{$t('login_btn')}}
    a-popover.navbar-popover(v-else placement="bottomRight" trigger="click")
      a.avatar-icon: avatar(:src="$store.state.avatar")
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

<style lang="less">
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
    text-shadow: @ele4;
    &:hover {
      color: rgba(255, 255, 255, 1);
    }
    &.is-active {
      color: rgba(255, 255, 255, 1);
      font-weight: bold;
    }
  }
  .avatar-icon {
    height: 100%;
    padding: 4px;
    transition: 0.4s @hoverEasing;
    img {
      box-shadow: @ele4;
    }
    &:hover {
      transform: scale(1.1);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
