<template lang="pug">
.section
  .container
    form.box(@submit.prevent="save")
      b-field(label="Title")
        b-input(v-model="post.title")
      b-field(label="Slogan")
        b-input(v-model="post.slogan")
      b-field(label="Content")
        client-only: markdown-editor(v-model="post.content")
      b-field(label="Cover image")
        upload(:background="post.cover && post.cover.thumbnail" type="covers" @upload="coverUploaded")
      meta-field(label="Cover artist" :value="post.metadata.cover" @input="metaFieldInput")
      b-button(native-type="submit" :loading="loading") Save
</template>

<script>
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
import MetaField from '@/components/MetaField'
import Upload from '@/components/Upload'
export default {
  name: 'PostManage',
  components: {
    MetaField,
    Upload,
  },
  data() {
    return {
      post: null,
      loading: false,
    }
  },
  async asyncData({ app, params, error, store }) {
    const user = store.state.user
    if (user.role !== 'admin' && user.role !== 'moderator') {
      return error({ statusCode: 403, message: "You don't have the permission to edit posts!" })
    }
    const post = await app.apolloProvider.defaultClient.query({
      query: gql`query StudioGetPosts($uid: String!) {
        post: getPost(uid: $uid) {
          id
          uid
          title
          slogan
          content
          creationDate
          state
          cover {
            thumbnail
          }
          metadata {
            cover {
              name
              localized_name
              url
            }
          }
        }
      }`,
      variables: { uid: params.id }
    }).then(({ data }) => data && data.post)
      .catch(err => handleErrorBlock(err, error))
    if (!post) {
      return error({ statusCode: 404, message: 'Post not found' })
    }
    if (post.cover?.thumbnail) {
      store.commit('setBackground', { source: post.cover.thumbnail })
    }
    return { post }
  },
  methods: {
    metaFieldInput(str, property) {
      if (!this.post.metadata.cover) {
        this.post.metadata.cover = {}
      }
      this.post.metadata.cover[property] = str
    },
    coverUploaded(path) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioUpdatePostForCover($id: ID!, $data: PostInput!) {
          post: updatePost(id: $id, input: $data) {
            id
            cover {
              thumbnail
            }
          }
        }`,
        variables: {
          id: this.post.id,
          data: {
            coverPath: path,
          },
        },
      })
        .then((res) => {
          const thumbnailURL = res.data.post?.cover?.thumbnail
          if (!this.post.cover) {
            this.post.cover = { thumbnail: thumbnailURL }
          } else {
            this.post.cover.thumbnail = thumbnailURL
          }
          this.$buefy.toast.open({
            message: 'Post Cover Updated',
            type: 'is-success',
          })
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    },
    save() {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioUpdatePost($id: ID!, $data: PostInput!) {
          updatePost(id: $id, input: $data) {
            id
          }
        }`,
        variables: {
          id: this.post.id,
          data: {
            title: this.post.title,
            slogan: this.post.slogan,
            content: this.post.content,
            state: this.post.state,
            metadata: {
              cover: {
                name: this.post.metadata.cover.name,
                localized_name: this.post.metadata.cover.localized_name,
                url: this.post.metadata.cover.url,
              }
            }
          },
        },
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Post Saved',
            type: 'is-success',
          })
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.loading = false
        })
    },
  }
}
</script>
