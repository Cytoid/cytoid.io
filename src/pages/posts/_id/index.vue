<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    h1.is-size-1(v-text="post.title")
    h5.is-size-5(v-text="post.slogan" style="margin-bottom: 2rem;")
    .buttons(style="margin-bottom: 5rem;")
      nuxt-link.button.is-large(
        :to="{ name: 'posts-id-manage', params: { id: post.uid }}"
        v-if="$store.state.user && ($store.state.user.role === 'admin' || $store.state.user.role === 'moderator')"
      )
        b-icon(icon="briefcase")
        span(v-t="'manage_btn'")
    .notification.is-warning(v-if="post.state === 'UNLISTED'") This post has expired
    .notification.is-primary(v-else-if="post.state === 'PRIVATE'") This post is not published
    collection-preview-card(v-if="post.collection" :value="post.collection")
    .columns
      .column.is-one-third
        .box(v-if="post.level")
          .title Level
          level-card(:value="post.level")
        .box
          .heading Last updated
          p(style="margin-bottom: 1rem;") {{$dateFormatCalendar(post.modificationDate)}}, {{ $dateFromNow(post.modificationDate) }}
          .heading Created At
          p {{$dateFormatCalendar(post.creationDate)}}, {{ $dateFromNow(post.creationDate) }}
        meta-box(:metadata="post.metadata")
      .column.is-two-thirds
        .box
          .content(v-html="content")
        div(style="margin: 12px;")
          disqus(shortname="cytoid" :identifier="'posts/' + post.uid" :url="'https://cytoid.io/posts/' + post.uid")
</template>

<script>
import gql from 'graphql-tag'
import marked from 'marked'
import Disqus from 'vue-disqus/src/vue-disqus.vue'
import PlayerAvatar from '@/components/player/PlayerAvatar'
import { Meta } from '@/utils'
import { handleErrorBlock } from '@/plugins/antd'
import MetaBox from '@/components/MetaBox'
import LevelCard from '@/components/level/LevelCard'
import CollectionPreviewCard from '@/components/collection/CollectionPreviewCard'
const query = gql`query GetPost($uid: String!) {
  post: getPost(uid: $uid) {
    id
    uid
    title
    slogan
    content
    state
    creationDate
    modificationDate
    startDate
    endDate
    cover {
      original
    }
    logo {
      original
    }
    metadata {
      cover {
        name
        localized_name
        url
      }
    }
    level {
      ...LevelCardFragment
    }
    collection {
      ...CollectionInfoFragment
      levels(limit: 5) {
        ...LevelCardFragment
      }
    }
  }
}
fragment LevelCardFragment on Level {
  id
  uid
  title
  owner {
    id
    uid
    name
    avatar {
      small
    }
  }
  metadata {
    title_localized
    artist {
      name
    }
  }
  bundle {
    backgroundImage {
      thumbnail
    }
    music
    musicPreview
  }
}
fragment CollectionInfoFragment on Collection {
  id
  uid
  title
  slogan
  cover {
    thumbnail
  }
  owner {
    id
    uid
    name
    avatar {
      small
    }
  }
}`
export default {
  layout: 'background',
  components: {
    MetaBox,
    PlayerAvatar,
    Disqus,
    LevelCard,
    CollectionPreviewCard,
  },
  data() {
    return {
      post: null,
    }
  },
  head() {
    const meta = new Meta(this.post.title, this.post.slogan)
    meta.extend('og:image', this.post.cover.original)
    return meta
  },
  computed: {
    content() {
      if (this.post.content) {
        return marked(this.post.content)
      }
      return null
    }
  },
  async asyncData({ params, store, error, app }) {
    const post = await app.apolloProvider.defaultClient.query({
      query,
      variables: { uid: params.id }
    }).then(({ data }) => data?.post)
      .catch(err => handleErrorBlock(err, error))
    if (!post) {
      return error({ statusCode: 404, message: 'Post not found' })
    }
    const image = post.cover?.original
    if (image) {
      store.commit('setBackground', { source: image })
    }
    return { post }
  },
}
</script>
