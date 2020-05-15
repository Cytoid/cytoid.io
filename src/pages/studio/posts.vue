<template lang="pug">
.section
  .heading Create a new Post
  .box
    form(@submit.prevent="createNew")
      b-field(label="UID")
        b-input(v-model="form.uid")
      b-field(label="Title")
        b-input(v-model="form.title")
      b-button(native-type="submit" :loading="createNewLoading") Create
  .box
    b-table.studio-table(
      :data="posts"
    )
      template(slot="empty")
        empty-placeholder
      template(v-slot:default="props")
        b-table-column(label="Post")
          .media
            .media-left
              nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'collections-id', params: { id: props.row.uid }}")
                img(v-if="props.row.cover" :src="props.row.cover.thumbnail")
            .media-content
              .content
                h4(v-text="props.row.title")
                p.is-size-7.has-text-grey ID: {{ props.row.uid }}
              ul.action-buttons
                li: nuxt-link(:to="{ name: 'posts-id-manage', params: { id: props.row.uid } }")
                  font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
        b-table-column(field="state" label="State") {{ props.row.state }}
</template>

<script>
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
export default {
  name: 'StudioPosts',
  components: {
    EmptyPlaceholder
  },
  data() {
    return {
      createNewLoading: false,
      posts: [],
      form: {
        uid: '',
        title: '',
      }
    }
  },
  async asyncData({ app, error }) {
    let posts = await app.apolloProvider.defaultClient.query({
      query: gql`query StudioGetPosts {
        posts: getPosts(limit: 10, all: true) {
          id
          uid
          title
          slogan
          creationDate
          state
          cover {
            thumbnail
          }
        }
      }`,
      variables: { }
    }).then(({ data }) => data?.posts)
      .catch(err => handleErrorBlock(err, error))
    if (!posts) {
      posts = []
    }
    return { posts }
  },
  methods: {
    createNew() {
      this.createNewLoading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioCreatePost($data: PostInput!) {
          createPost(post: $data) {
            id
            uid
          }
        }`,
        variables: {
          data: this.form,
        },
      })
        .then((post) => {
          console.log(post)
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.createNewLoading = false
        })
    }
  }
}
</script>
