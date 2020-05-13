<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'levels-id-manage-analytics'}")
            font-awesome-icon(:icon="['fas', 'analytics']" fixed-width)
            span.menu-text Analytics
          li: nuxt-link(:to="{name: 'levels-id-manage-listing'}")
            font-awesome-icon(:icon="['fas', 'edit']" fixed-width)
            span.menu-text Edit listing
          li: nuxt-link(:to="{name: 'levels-id-manage-level'}")
            font-awesome-icon(:icon="['fas', 'file-edit']" fixed-width)
            span.menu-text Edit level
    .column.is-three-quarters: nuxt-child(v-if="level" :value="level")
</template>

<script>
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
import { Meta } from '@/utils'
const query = gql`query FetchLevelForEditing($uid: String!) {
  level(uid: $uid) {
    id
    uid
    title
    description
    state
    censored
    size
    tags
    creationDate
    modificationDate
    category
    owner {
      id
      uid
      name
      avatar { large }
    }
    charts {
      difficulty
      type
      name
      notesCount
    }
    metadata {
      artist {
        name
        localized_name
        url
      }
      illustrator {
        name
        localized_name
        url
      }
      charter {
        name
        localized_name
        url
      }
      storyboarder {
        name
        localized_name
        url
      }
    }
    rating {
      average
      total
      distribution
      rating
    }
    bundle {
      musicPreview
      backgroundImage {
        original
      }
    }
  }
}`
export default {
  layout: 'background',
  middleware: 'auth',
  data() {
    return {
      level: null,
    }
  },
  async asyncData({ app, $axios, params, store, error }) {
    const user = store.state.user
    const level = await app.apolloProvider.defaultClient.query({
      query,
      variables: {
        uid: params.id
      }
    }).then(({ data }) => data?.level)
      .catch(err => handleErrorBlock(err, error))
    if (!level) {
      return error({ statusCode: 404, message: 'Level not found' })
    }
    if (level.owner.id !== user?.id && !(user?.role === 'admin' || user?.role === 'moderator')) {
      return error({ statusCode: 403, message: "You don't have the permission to edit this level!" })
    }
    store.commit('setBackground', { source: level.bundle?.backgroundImage?.original })
    return { level }
  },
  head() {
    return new Meta(this.level.title, this.level.description, 'Manage')
  },
  fetch({ route, redirect }) {
    const test = /^\/levels\/(.+)\/manage$/.exec(route.fullPath)
    if (test) {
      return redirect(route.fullPath + '/listing')
    }
  },
}
</script>

<style lang="less" scoped>
.menu-text {
  font-size: 14px;
  font-weight: normal;
  margin-left: 8px;
}
a.is-active .menu-text {
  font-weight: bold;
}
.menu-list {
  li {
    margin-bottom: 8px;
  }
  a {
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    transition: 0.2s @hoverEasing;
    &:hover {
      color: rgba(255, 255, 255, 1);
      background-color: hsla(226, 15%, 19%, 0.3);
    }
  }
  a.is-active {
    color: rgba(255, 255, 255, 1);
    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(209,14,134,1) 0%, rgba(234,55,59,0.76) 90.8% );
    box-shadow: @ele4;
  }
}
</style>
