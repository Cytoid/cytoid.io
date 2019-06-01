<template lang="pug">
header.navbar.light.container(role="navigation")
  nuxt-link.navbar-item(to="/levels") Levels
  search.left
  nuxt-link(v-if="!user" to="/session/signin"): a-button(type="primary") Login
  a-popover(v-else title="Title" placement="bottomRight" trigger="click")
    a-avatar(:src="user.avatarURL")
    template(slot="content")
      Content
      Content
</template>

<script>
import Search from './SearchInput'
export default {
  components: {
    Search,
  },
  data: () => ({
    expanded: false,
  }),
  computed: {
    user() {
      return this.$auth.user
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    }
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
    &:hover {
      color: $white-bis;
    }
    &.is-active {
      color: $white;
    }
  }
}
</style>
