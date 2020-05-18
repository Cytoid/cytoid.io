<template lang="pug">
  .section
    .container
      .title Search results for {{$route.query.search}}
      empty-placeholder(v-if="!levels || levels.length === 0")
      b-loading(:active="loading")
      .level-card-container.large(style="margin-top: 16px; margin-bottom: 16px;")
        level-card(v-for="level in levels" :key="level.id" :value="level")
</template>

<script>
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import gql from 'graphql-tag'
import LevelCard from '@/components/level/LevelCard'
import { handleErrorBlock } from '@/plugins/antd'
const graphqlQuery = gql`query SearchLevels($search: String!) {
  levels: searchLevels(search: $search) {
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
    charts {
      id
      name
      difficulty
      type
      notesCount
    }
    bundle {
      backgroundImage {
        thumbnail
      }
      music
      musicPreview
    }
  }
}`
export default {
  name: 'SearchPage',
  components: {
    LevelCard,
    EmptyPlaceholder,
  },
  data() {
    return {
      loading: false,
      levels: [],
    }
  },
  head() {
    return {
      title: 'Levels - Cytoid'
    }
  },
  watch: {
    '$route.query.search'() {
      this.loading = true
      return this.$apollo.query({
        query: graphqlQuery,
        variables: { search: this.$route.query.search }
      }).then(({ data }) => {
        this.levels = data.levels
      })
        .catch(err => this.handleErrorToast(err))
        .then(() => {
          this.loading = false
        })
    }
  },
  asyncData({ store, error, app, query }) {
    if (!query.search) {
      return {}
    }
    return app.apolloProvider.defaultClient.query({
      query: graphqlQuery,
      variables: { search: query.search }
    }).then(({ data }) => {
      return { levels: data.levels }
    })
      .catch(err => handleErrorBlock(err, error))
  },
  i18n: {
    key: 'levels'
  }
}
</script>
