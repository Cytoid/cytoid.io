<template lang="pug">
div
  .section: .container.level-card-container.large
    collection-simple-card(v-for="collection in collections" :key="collection.id" :value="collection")
  .section: .container
    b-button.is-block(
      :loading="loading"
      @click="loadMore"
      :style="{ width: '100%' }"
      v-if="hasMore"
    ) Load More
</template>

<script>
import gql from 'graphql-tag'
import CollectionSimpleCard from '../../components/collection/CollectionSimpleCard'
export default {
  name: 'CollectionList',
  components: {
    CollectionSimpleCard
  },
  data () {
    return {
      loading: false,
      hasMore: true,
    }
  },
  apollo: {
    collections: {
      query: gql`query FetchCollections($cursor: ID, $limit: Int!){
        collections(limit: $limit, cursor: $cursor) {
          id
          uid
          cover {
            thumbnail
          }
          title
          slogan
          levelCount
          creationDate
        }
      }`,
      variables: {
        limit: 32,
        cursor: null,
      },
    }
  },
  methods: {
    loadMore () {
      this.loading = true
      this.$apollo.queries.collections.fetchMore({
        variables: {
          limit: 32,
          cursor: this.collections[this.collections.length - 1].id,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.loading = false
          this.hasMore = fetchMoreResult.collections.length > 0
          console.log(this.hasMore)
          if (!this.hasMore) {
            return previousResult
          }
          return {
            collections: [...previousResult.collections, ...fetchMoreResult.collections],
          }
        },
      })
    },
  }
}
</script>
