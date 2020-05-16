<template lang="pug">
  div
    .section: .container
      post-card.post-card(v-for="post in posts" :key="post.id" :value="post")
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
import PostCard from '@/components/post/PostCard'
export default {
  name: 'CollectionList',
  components: {
    PostCard,
  },
  data() {
    return {
      loading: false,
      hasMore: true,
    }
  },
  apollo: {
    posts: {
      query: gql`query FetchPosts($cursor: String, $limit: Int!){
        posts: getPosts(limit: $limit, cursor: $cursor) {
          id
          uid
          title
          slogan
          cover {
            stripe
          }
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
    loadMore() {
      this.loading = true
      this.$apollo.queries.posts.fetchMore({
        variables: {
          limit: 32,
          cursor: this.posts[this.posts.length - 1].id,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.loading = false
          this.hasMore = fetchMoreResult.posts.length > 0
          if (!this.hasMore) {
            return previousResult
          }
          return {
            posts: [...previousResult.posts, ...fetchMoreResult.posts],
          }
        },
      })
    },
  }
}
</script>
