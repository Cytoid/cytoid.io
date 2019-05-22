<template lang="pug">
  div
    background
    nav-bar.is-transparent
      nuxt-link.navbar-item(slot="brand" to="/" exact) Cytoid
      template(slot="start")
        nuxt-link.navbar-item(to="/levels") Levels
        nuxt-link.navbar-item(to="/collections") Collections
      template(slot="append")
        nuxt-link.navbar-item(v-if="$auth.loggedIn" to="/me") Profile
        .navbar-item(v-else)
          nuxt-link.button.is-primary(to="/session/signin") Sign In
    nuxt
</template>

<script>
import Background from '@/components/Background'
import NavBar from '@/components/NavBar'
export default {
  components: {
    Background,
    NavBar,
  },
  data() {
    return {
      userPopoverVisible: false,
    }
  }
}
</script>
