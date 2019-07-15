<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    h1(class="text-ele" style="margin-bottom: 16px; line-height: 1.0;" v-text="post.title")
    div(class="text-ele" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-bottom: 20px;" v-text="post.description")
    a-row(:gutter="16")
      a-col(:xs="24" :lg="8")
        a-card(class="ele3" style="margin-bottom: 16px;")
          player-avatar(style="margin-bottom: 16px;" :player="owner")
          template(v-if="post.tags.length > 0")
            .card-heading Tags
            div(style="margin-bottom: 16px;")
              a(v-for="tag in post.tags" :key="tag" :href="'/posts?tags=' + tag.toLowerCase()")
                a-tag {{ tag }}
          .card-heading Last updated
          .card-secondary-text(style="margin-bottom: 0px;") {{ readableDate(post.modified_on).fromNow() }}
        a-card(class="ele3" style="margin-bottom: 16px;")
          p(class="card-heading") Cover art
          p(class="card-em-text" style="margin-bottom: 4px;") {{ post.cover_artist }}
          a(:href="makeLink(post.cover_artist_url)")
            a-button(class="card-button" style="width: fit-content; margin-top: -2px; margin-bottom: 4px; padding-left: 12px; padding-right: 14px;")
              font-awesome-icon(icon="link" fixed-width style="margin-right: 4px;")
              span Source
      a-col(:xs="24" :lg="16")
        a-card
          div(v-html="post.content")
        div(style="margin: 12px;")
          disqus(shortname="cytoid" :identifier="'posts/' + post.slug" :url="'https://cytoid.io/posts/' + post.slug")
</template>

<script>
import moment from 'moment'
import Disqus from 'vue-disqus/src/vue-disqus.vue'
import PlayerAvatar from '@/components/player/PlayerAvatar'

export default {
  layout: 'background',
  components: {
    PlayerAvatar,
    Disqus,
  },
  data: () => ({
    post: null,
    owner: {
      uid: 'Loading...',
      avatarURL: null
    }
  }),
  async asyncData({ $axios, params, store, error }) {
    const results = {}
    const postResponse = await $axios.get(`http://cms.cytoid.io/api/items/posts?filter[slug][eq]=${params.id}&fields=*.*`)
    const postData = postResponse.data.data[0]
    store.commit('setBackground', { source: postData.cover_art.data.full_url })
    results.post = postData
    const ownerResponse = await $axios.get('/profile/' + postData.owner)
    results.owner = ownerResponse.data.user
    console.log(results.owner.user)
    return results
  },
  methods: {
    readableDate(date) {
      return moment.utc(date)
    },
    makeLink(link) {
      if (link == null) return 'about:blank'
      return (link.indexOf('://') === -1) ? 'http://' + link : link
    }
  },
}
</script>

<style lang="less">
</style>
