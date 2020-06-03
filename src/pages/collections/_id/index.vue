<template lang="pug">
.container(v-if="collection")
  section.section.header-container
    h1.is-size-1(v-text="collection.title")
    h5.is-size-5(v-text="collection.slogan")
  section.section
    nuxt-link.button.is-large(
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
        .content(v-html="formattedDescriptions" style="margin-bottom: 1rem;")
        template(v-if="collection.tags.length > 0")
          .box-subtitle(v-t="'tags_title'")
          .tags(style="margin-bottom: 16px;")
            .tag(v-for="tag in collection.tags" :key="tag" v-text="tag")
        .box-subtitle(v-t="'creation_date_title'")
        p(style="margin-bottom: 1rem;") {{$dateFormatCalendar(collection.creationDate)}}, {{ $dateFromNow(collection.creationDate) }}
        .box-subtitle(v-t="'modification_date_title'")
        p {{$dateFormatCalendar(collection.modificationDate)}}, {{ $dateFromNow(collection.modificationDate) }}
      meta-box(:metadata="collection.metadata")
    .column.is-three-quarters
      .level-card-container.small
        level-card(v-for="level in collection.levels" :key="level.id" :value="level")
      div(style="margin: 12px;")
        captcha(ref="captcha")
        thread(category="collection" :thread="collection.uid")
</template>

<script>
import marked from 'marked'
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
import LevelCard from '@/components/level/LevelCard'
import PlayerAvatar from '@/components/player/PlayerAvatar'
import MetaBox from '@/components/MetaBox'
import Captcha from '@/components/Captcha'
import Thread from '@/components/comments/Thread'

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
    cover {
      original
    }
    owner {
      id
      uid
      name
      avatar {
        small
      }
    }
    levels {
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
        musicPreview
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
    MetaBox,
    Thread,
    Captcha,
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
    if (collection.cover) {
      store.commit('setBackground', { source: collection.cover.original })
    }
    return { collection }
  },
  i18n: {
    key: 'collection_details'
  }
}
</script>

<style scoped>
.header-container {
  margin-top: 256px;
}
</style>
