<template lang="pug">
div
  .section: .container.level-card-container.large
    collection-simple-card(v-for="collection in collections" :key="collection.id" :value="collection")
  .section: .container
    b-button.is-block(
      :loading="loading"
      @click="loadQuery"
      :style="{ width: '100%' }"
      v-if="hasMore"
    ) Load More
</template>

<script>
import { faTireRugged } from '@fortawesome/pro-duotone-svg-icons'
import gql from 'graphql-tag'
import CollectionSimpleCard from '../../components/collection/CollectionSimpleCard'

const pageLimit = 32

const query = gql`
  query FetchCollections($cursor: ID, $limit: Int!, $ownerId: String){
    collections(limit: $limit, cursor: $cursor, ownerId: $ownerId) {
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
  }
`
export default {
  name: 'CollectionList',
  components: {
    CollectionSimpleCard
  },
  data () {
    return {
      loading: false,
      hasMore: true,
      collections: []
    }
  },
  methods: {
    loadQuery () {
      this.loading = faTireRugged
      this.$apollo.query({
        query,
        variables: {
          limit: pageLimit,
          cursor: this.collections.length > 0 ? this.collections[this.collections.length - 1].id : null,
          ownerId: this.$route.query.owner
        }
      })
        .then((res) => {
          this.loading = false
          this.hasMore = res.data.collections.length > pageLimit
          if (res.data.collections.length > 0) {
            this.collections.push(...res.data.collections)
          }
        })
    }
  },
  mounted: function() {
    this.loadQuery()
  }
}
</script>
