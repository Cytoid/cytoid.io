<template lang="pug">
nav.navbar.is-transparent(role='navigation', aria-label='main navigation')
  .container
    .navbar-brand
      nuxt-link.navbar-item(to="/") Cytoid
      .navbar-burger(
        :class="{ 'is-active': navbarActivated }"
        @click="navbarActivated = !navbarActivated"
      )
        span
        span
        span
    .navbar-menu(:class="{ 'is-active': navbarActivated }")
      .navbar-start
        nuxt-link.navbar-item(to="/levels") Levels
      .navbar-end
        span(v-if="user").navbar-item.has-dropdown.is-hoverable
          span.navbar-link Me
          .navbar-dropdown.is-right.is-boxed
            a.navbar-item Profile
            a.navbar-item Favorites
            hr.navbar-divider
            a.navbar-item Create Levels
            a.navbar-item Create Collections
            hr.navbar-divider
            a.navbar-item Settings
            a.navbar-item(@click="logout") Logout
        .navbar-item(v-else)
          .buttons
            nuxt-link.button.is-primary(to="/session/login") Login
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      navbarActivated: false,
    }
  },
  computed: mapState([
    'user',
  ]),
  methods: {
    ...mapActions([
      'logout',
    ])
  },
}
</script>
