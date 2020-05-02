<template lang="pug">
header.navbar(role="navigation"): .container
  .navbar-brand
    a.navbar-burger.burger(role="button" aria-label="menu" aria-expanded="false" @click="active = !active")
      span(aria-hidden="true" v-for="n in 3")
  .navbar-menu(:class="{ 'is-active': active }")
    .navbar-start
      nuxt-link.navbar-item(:to="{ name: 'index' }" exact) {{$t('nav_home')}}
      nuxt-link.navbar-item(:to="{ name: 'levels' }") {{$t('nav_levels')}}
      a.navbar-item(href='https://sites.google.com/site/cytoidcommunity' target="_blank" v-t="'nav_wiki'")
    client-only.navbar-end
      search.left.navbar-item
      .navbar-item(v-if="!$store.state.user")
        nuxt-link.button(:to="{ name: 'session-login' }") {{$t('login_btn')}}
      b-dropdown.popover(
        mobile-modal
        v-else
        position="is-bottom-left"
        append-to-body
        aria-role="menu"
      )
        a.navbar-item.navbar-avatar(slot="trigger"): avatar(:source="avatarURL")
        b-dropdown-item(custom paddingless)
          nav-card
</template>

<script>
import Search from './SearchInput'
import NavCard from './NavCard'
export default {
  components: {
    Search,
    NavCard,
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    avatarURL() {
      return `${process.env.apiURL}/users/${this.$store.state.user.id}/avatar`
    }
  }
}
</script>

<style lang="scss">
.navbar {
  .navbar-item.is-active {
    color: #fff;
    font-weight: bold;
  }
  .navbar-avatar {
    &:hover {
      transform: scale(1.1);
    }
  }
  .popover {
    height: 100%;
    .dropdown-content {
      padding-top: 0;
      padding-bottom: 0;
      border-radius: 3px;
      overflow: hidden;
    }
  }
}
</style>
