<template lang="pug">
header.navbar.is-transparent(role="navigation")
  .container
    .navbar-brand
      nuxt-link.navbar-item(to="/" exact) Cytoid
      .navbar-burger(@click="expanded = !expanded" :class="{ 'is-active': expanded }")
        span
        span
        span
    .navbar-menu(:class="{ 'is-active': expanded }")
      .navbar-start
        nuxt-link.navbar-item(to="/levels") Levels
        nuxt-link.navbar-item(to="/collections") Collections
      no-ssr.navbar-end
        .navbar-item.has-dropdown.is-hoverable(v-if="$auth.loggedIn")
          nuxt-link.navbar-link(to="/me")
            a-avatar.navbar-dropdown-title-avatar(:src="user.avatarURL" size="small")
            span(v-text="user.name || user.uid")
          .navbar-dropdown
            nuxt-link.navbar-item(to="/me/upload") Upload
            .navbar-divider
            a.navbar-item(@click="logout") Sign Out
        .navbar-item(v-else)
          nuxt-link(to="/session/signin")
            a-button(style="font-size: 14px;") Sign in
</template>

<script>
export default {
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
  }
}
</script>

<style>
.navbar-dropdown-title-avatar {
  margin-right: 0.5rem;
}
</style>
