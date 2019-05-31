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
          nuxt-link(to="/session/signin")
            a-button(style="font-size: 14px;") Sign in
    nuxt
    footer.container.footer.has-text-centered
      ul
        li Terms & Services
        li Status
        li: a(href="https://github.com/Cytoid/" target="_blank") GitHub
        li Glory Wall
      p.
        #[strong Cytoid] built by
        #[strong Tiger Tang] and #[strong Zhixing Zhang].
        All rights reserved.
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

<style lang="scss">
.footer ul li {
  display: inline;
  &:not(:first-child)::before {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    content: '|';
  }
}
</style>
