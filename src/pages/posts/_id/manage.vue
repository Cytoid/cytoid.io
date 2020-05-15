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
      meta-field(label="Cover artist" :value="post.metadata.cover")
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
    coverUploaded(path) {
      this.avatarURL = null
      this.$apollo.mutate({
        mutation: gql`mutation UpdateCover($path: String) {
          result: setAvatar(path: $path) {
            large
          }
        }`,
        variables: { path }
      })
        .then((res) => {
          this.avatarURL = res.data?.result?.large
          this.$buefy.toast.open({
            message: 'Cover updated',
            type: 'is-success'
          })
        })
    },
  }
}
</script>
