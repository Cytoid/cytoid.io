<template lang="pug">
div
  .section: .container
    .heading(v-t="'owned_levels'")
    .level-card-container.large
      level-card(v-for="level in grantedLevels" :key="level.id" :value="level")
  .section: .container
    .heading(v-t="'favorites'")
    .level-card-container.large
      level-card(v-for="level in levels" :key="level.id" :value="level")
</template>

<script>
import gql from 'graphql-tag'
import LevelCard from '@/components/level/LevelCard'
import { handleErrorBlock } from '../plugins/antd'
const query = gql`query FetchUserCollections {
  my {
    grantedLevels: library(granted: true) {
      ...LevelCardFragment
    }
    levels: library(granted: false) {
      ...LevelCardFragment
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
}`
export default {
  name: 'LibraryPage',
  components: {
    LevelCard,
  },
  data() {
    return {
      levels: [],
      grantedLevels: [],
    }
  },
  async asyncData({ params, error, app, store }) {
    return await app.apolloProvider.defaultClient.query({
      query,
    }).then(({ data }) => ({
      levels: data?.my?.levels,
      grantedLevels: data?.my?.grantedLevels,
    }))
      .catch(err => handleErrorBlock(err, error))
  }
}
</script>
