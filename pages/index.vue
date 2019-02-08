<template lang="pug">
div
  section.section
    .container
      | test content
  section.hero.is-medium.is-dark.is-bold
    .hero-body
      .container.has-text-centered
        h1.title Haven't downloaded yet?
        h2.subtitle Sometimes good things happen to be free
        #app-download-btn-container
          a.button.is-lightning.is-large(href='https://itunes.apple.com/us/app/cytoid/id1266582726', target='_blank', role='button')
            b-icon(pack='fab', icon='apple', size='is-middle')
            .is-size-6.has-text-left
              p Download on the
              strong App Store
          a.button.is-lightning.is-large(href='https://itunes.apple.com/us/app/cytoid/id1266582726', target='_blank', role='button')
            b-icon(pack='fab', icon='google-play', size='is-middle')
            .is-size-6.has-text-left
              p Get it on
              strong Google Play

</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
#app-download-btn-container a {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
