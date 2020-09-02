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
      :mobile-cards="false"
      scrollable
      :data="posts"
    )
      template(slot="empty")
        empty-placeholder
      template
        b-table-column(v-slot="props" label="Post")
          .media
            .media-left
              nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'posts-id', params: { id: props.row.uid }}")
                img(v-if="props.row.cover" :src="props.row.cover.thumbnail")
            .media-content
              h4(v-text="props.row.title")
              p.is-size-7 ID: {{ props.row.uid }}
              ul.action-buttons
                li: nuxt-link(:to="{ name: 'posts-id-manage', params: { id: props.row.uid } }")
                  font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                li: a(@click="openDeleteModal(props.row)")
                  font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
        b-table-column(v-slot="props" field="type" label="Type") {{ props.row.type }}
        b-table-column(v-slot="props" field="state" label="State") {{ props.row.state }}
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
  async asyncData ({ app, error }) {
    let posts = await app.apolloProvider.defaultClient.query({
      query: gql`query StudioGetPosts {
        posts: getPosts(limit: 100, all: true) {
          id
          type
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
  data () {
    return {
      createNewLoading: false,
      posts: [],
      form: {
        uid: '',
        title: '',
      }
    }
  },
  methods: {
    createNew () {
      this.createNewLoading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioCreatePost($data: PostInput!) {
          post: createPost(post: $data) {
            id
            uid
          }
        }`,
        variables: {
          data: this.form,
        },
      })
        .then((post) => {
          const uid = post.data.post.uid
          this.$router.push({ name: 'posts-id-manage', params: { id: uid } })
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.createNewLoading = false
        })
    },
    openDeleteModal (post) {
      this.$buefy.dialog.confirm({
        title: 'Deleting ' + (post.title || post.uid),
        message: 'Are you sure you want to delete this post?',
        confirmText: 'Delete Post',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deletePost(post),
      })
    },
    deletePost (post) {
      this.$apollo.mutate({
        mutation: gql`mutation StudioDeletePost($id: ID!) {
          deletePost(id: $id) {
            id
          }
        }`,
        variables: {
          id: post.id
        },
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Post Deleted',
            type: 'is-warning'
          })
          const index = this.posts.indexOf(post)
          if (index !== -1) {
            this.posts.splice(index, 1)
          }
        })
        .catch(this.handleErrorToast)
    }
  }
}
</script>
