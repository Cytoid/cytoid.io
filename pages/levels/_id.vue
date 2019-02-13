<template lang="pug">
div
  section.hero.is-dark.is-fullheight-with-navbar#level-hero(
    :style="{ backgroundImage: 'url(' + level.background.url + ')' }"
    )
    .hero-head
      nav-bar
    .hero-body: .container.has-text-left
      div#title-container.is-inline-block
        h1.title(v-text="level.title")
        h2.subtitle(v-text="level.metadata.artist && level.metadata.artist.name")
    .hero-foot
      nav.tabs.is-boxed.is-fullwidth.container
        ul
          nuxt-link(tag="li" replace exact active-class="is-active" :to="{ name: 'levels-id-ranking' }"): a Ranking
          nuxt-link(tag="li" replace exact active-class="is-active" :to="{ name: 'levels-id' }"): a Details
          nuxt-link(tag="li" replace exact active-class="is-active" :to="{ name: 'levels-id-playback' }"): a Playback
  nuxt-child(:value="level")
</template>

<script>
import NavBar from '@/layouts/components/NavBar'
export default {
  name: 'LevelDetail',
  layout: 'blank',
  components: {
    NavBar,
  },
  data() {
    return {
      level: null,
    }
  },
  asyncData({ params, $axios, error }) {
    return $axios.get('/levels/' + params.id)
      .then((res) => {
        res.data.background.url = 'https://storage.googleapis.com/staging.cytoid.appspot.com' + res.data.background.url
        return {
          level: res.data
        }
      })
      .catch((err) => {
        if (err.response) {
          error({
            statusCode: err.response.status,
            message: err.response.status === 404 ? 'Level not found' : 'Server Error'
          })
        } else if (err.request) {
          error({ statusCode: 504, message: 'Request Timeout' })
        } else {
          error({ statusCode: 503, message: 'Can not communicate with the server' })
        }
      })
  },
}
</script>

<style scoped lang="scss">
#level-hero {
  .hero-head {
    background-color: rgba($dark, .5);
    box-shadow: 0 0 1rem 1rem rgba($dark,.5);
  }
  .hero-body .container #title-container {
    margin-left: 10%;
    background-color: rgba($dark, .5);
    padding: 1%;
    box-shadow: 0 0 2rem 2rem rgba($dark,.5);
  }
  .hero-foot .tabs{
    li {
      &.is-active a {
        background-color: $dark;
        border-color: $dark;
        color: $dark-invert;
        opacity: 1;
        &:hover {
          opacity: 1;
          background-color: $dark;
        }
      }
      a {
        border-color: transparent;
        background-color: rgba($dark, 0.5);
        opacity: 1;
        &:hover {
          background-color: rgba($dark, 0.7);
        }
        transition: background-color 0.2s;
      }
    }
  }
}
</style>
