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
      b-field(label="Visibility" :addons="false")
        visibility-select(:value="post.state" @change="post.state = $event")
        .help Public: The post is visible on both the game client and Cytoid.io
        .help Unlisted: The post is only visible on Cytoid.io "History Posts"
        .help Private: The post is not active and invisible
      captcha(size="invisible" ref="captcha")
      b-field(label="Cover image")
        upload(:background="post.cover && post.cover.thumbnail" type="covers" @upload="coverUploaded" :captchaFunc="getCaptcha")
      b-field(label="Logo")
        upload(:background="post.logo && post.logo.thumbnail" type="logos" @upload="logoUploaded"  :captchaFunc="getCaptcha")
      meta-field(label="Cover artist" :value="post.metadata.cover" @input="metaFieldInput")
      b-field(label="Associated Level" :addons="false" :type="level ? 'is-success' : null")
        level-select(v-model="level")
        .help Input the level UID here
      b-field(label="Associated Collection" :addons="false" :type="collection ? 'is-success' : null")
        collection-select(v-model="collection")
        .help Input the collection UID here
      b-field(label="Start date")
        b-datetimepicker(
          v-model="post.startDate"
          icon="calendar"
          editable)
          template(slot="right")
            b-button(@click="post.startDate = null" type="is-danger" icon-left="times") Clear
      b-field(label="End date" :addons="false")
        b-datetimepicker(
          v-model="post.endDate"
          icon="calendar"
          editable)
          template(slot="right")
            b-button(@click="post.endDate = null" type="is-danger" icon-left="times") Clear
        .help All dates & times are in local timezone
      b-button(native-type="submit" :loading="loading") Save
</template>

<script>
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
import MetaField from '@/components/MetaField'
import Upload from '@/components/Upload'
import VisibilitySelect from '@/components/studio/VisibilitySelect'
import LevelSelect from '@/components/studio/LevelSelect'
import CollectionSelect from '@/components/studio/CollectionSelect'
import Captcha from '@/components/Captcha'
export default {
  name: 'PostManage',
  components: {
    MetaField,
    Upload,
    VisibilitySelect,
    LevelSelect,
    CollectionSelect,
    Captcha,
  },
  data() {
    return {
      post: null,
      loading: false,
      level: null,
      collection: null,
    }
  },
  async asyncData({ app, params, error, store }) {
    const user = store.state.user
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
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
          startDate
          endDate
          state
          level {
            id
            uid
            title
          }
          collection {
            id
            uid
            title
          }
          cover {
            thumbnail
          }
          logo {
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
    const res = { post }
    if (post.level) {
      res.level = post.level
    }
    if (post.collection) {
      res.collection = post.collection
    }
    if (post.startDate) {
      post.startDate = new Date(post.startDate)
    }
    if (post.endDate) {
      post.endDate = new Date(post.endDate)
    }
    return res
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
    logoUploaded(path) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioUpdateLogoForCover($id: ID!, $data: PostInput!) {
          post: updatePost(id: $id, input: $data) {
            id
            logo {
              thumbnail
            }
          }
        }`,
        variables: {
          id: this.post.id,
          data: {
            logoPath: path,
          },
        },
      })
        .then((res) => {
          const thumbnailURL = res.data.post?.logo?.thumbnail
          if (!this.post.logo) {
            this.post.logo = { thumbnail: thumbnailURL }
          } else {
            this.post.logo.thumbnail = thumbnailURL
          }
          this.$buefy.toast.open({
            message: 'Post Logo Updated',
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
    getCaptcha() {
      return this.$refs.captcha.execute()
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
            levelId: this.level?.id || null, // Needs || null otherwise levelId won't be updated
            collectionId: this.collection?.id || null,
            startDate: this.post.startDate || null,
            endDate: this.post.endDate || null,
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
