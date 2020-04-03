<template lang="pug">
.section
  .box
    .card-heading Create a new post
    form(@submit.prevent="createNew")
      b-field(label="UID")
        b-input(v-model="form.uid")
      b-field(label="Title")
        b-input(v-model="form.title")
      b-button(native-type="submit" :loading="createNewLoading") Create
  .box
    .card-heading Create a new collection
    b-table.posts-table(
      :data="posts"
      detailed
      hoverable
      icon-pack="fas"
    )
      template(v-slot:default="props")
        b-table-column(field="uid" label="UID") {{ props.row.uid }}
        b-table-column(field="title" label="Title") {{ props.row.title }}
        b-table-column(field="state" label="State") {{ props.row.state }}
        b-table-column(field="levelCount" label="Levels") {{ props.row.levelCount }}
      template(v-slot:detail="props")
        article.media
          figure.media-left
            .image.is-4by3
              img(:src="$img(props.row.coverPath, { height: 64 })")
          .media-content
            .content
              strong(v-text="props.row.title")
              br
              small(v-text="props.row.slogan")
            .level.is-mobile: .level-left
              nuxt-link.level-item(:to="{ name: 'collections-id-manage', params: { id: props.row.uid } }")
                b-icon(icon="suitcase")
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'StudioPosts',
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

<style>
  .posts-table table {
    width: 100%;
  }
</style>
