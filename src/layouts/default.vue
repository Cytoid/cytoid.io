<template lang="pug">
  div
    background
    nav-bar
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
