<template lang="pug">
.container(v-if="collection")
  section.section.header-container
    h1.text-ele(v-text="collection.title")
    h3.text-ele(v-text="collection.slogan")
  section.section
    nuxt-link.button(
      :to="{ name: 'collections-id-manage', params: { id: collection.uid } }"
      v-if="$store.state.user && (collection.owner.id === $store.state.user.id || $store.state.user.role === 'admin' || $store.state.user.role === 'moderator')"
    )
      font-awesome-icon(icon="briefcase" fixed-width style="margin-right: .5rem;")
      span(v-t="'manage_btn'")
  section.section
    .notification.is-warning(v-if="collection.state === 'PRIVATE'" v-t="'message_private'")
    .notification.is-primary(v-else-if="collection.state === 'UNLISTED'" v-t="'message_unlisted'")
  section.section.columns
    .column
      .box
        player-avatar(style="margin-bottom: 16px;" :player="collection.owner")
        .content(v-html="formattedDescriptions")
        template(v-if="collection.tags.length > 0")
          .card-heading(v-t="'tags_title'")
          .tags(style="margin-bottom: 16px;")
            .tag(v-for="tag in collection.tags" :key="tag" v-text="tag")
        .card-heading(v-t="'creation_date_title'")
        .card-secondary-text(style="margin-bottom: 1rem;") {{$dateFormatCalendar(collection.creationDate)}}, {{ $dateFromNow(collection.creationDate) }}
        .card-heading(v-t="'modification_date_title'")
        .card-secondary-text {{$dateFormatCalendar(collection.modificationDate)}}, {{ $dateFromNow(collection.modificationDate) }}
      .box(v-if="collection.metadata.cover")
          p.card-heading(v-t="'metadata_cover_art_title'")
          p.card-em-text(style="margin-bottom: 4px;" v-text="collection.metadata.cover.name")
          a(v-if="collection.metadata.cover.url" :href="collection.metadata.cover.url")
            a-button.card-button
              font-awesome-icon(icon="link" fixed-width style="margin-right: 4px;")
              span Source
    .column.is-three-quarters
      .level-card-container.small
        level-card(v-for="level in collection.levels" :key="level.id" :value="level")
</template>

<script>
import marked from 'marked'
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
import LevelCard from '@/components/level/LevelCard'
import PlayerAvatar from '@/components/player/PlayerAvatar'

const query = gql`query FetchCollection($uid: String!) {
  collection(uid: $uid) {
    id
    uid
    title
    slogan
    description
    creationDate
    modificationDate
    tags
    state
    coverPath
    owner {
      id
      uid
      name
      avatarURL
    }
    levels {
      id
      uid
      title
      owner {
        id
        uid
        name
        avatarURL
      }
      metadata {
        title_localized
        artist {
          name
        }
      }
      bundle {
        background: backgroundImage
        music
        music_preview: musicPreview
      }
      charts {
        type
        difficulty
        name
        notesCount
      }
    }
    metadata {
      cover {
        name
        url
      }
    }
  }
}`
export default {
  layout: 'background',
  name: 'Collection',
  components: {
    LevelCard,
    PlayerAvatar,
  },
  data() {
    return {
      collection: null
    }
  },
  computed: {
    formattedDescriptions() {
      return marked(this.collection.description)
    },
  },
  async asyncData({ params, error, app, store }) {
    const collection = await app.apolloProvider.defaultClient.query({
      query,
      variables: { uid: params.id }
    }).then(({ data }) => data && data.collection)
      .catch(err => handleErrorBlock(err, error))
    if (!collection) {
      return error({ statusCode: 404, message: 'Collection not found' })
    }
    store.commit('setBackground', { source: collection.coverPath })
    return { collection }
  },
  i18n: {
    key: 'collection_details'
  }
}
</script>

<style lang="less" scoped>
.header-container {
  margin-top: 256px;
}
</style>
