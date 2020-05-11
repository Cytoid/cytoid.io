<template lang="pug">
.section
  .box
    .card-heading Create a new collection
    form(@submit.prevent="createNew")
      b-field(label="UID")
        b-input(v-model="form.uid")
      b-field(label="Title")
        b-input(v-model="form.title")
      b-button(native-type="submit" :loading="createNewLoading") Create
  .box
    b-table.studio-table(
      :data="collections"
    )
      template(slot="empty")
        section.section
          .content.has-text-centered
            font-awesome-icon(icon="empty-set" size="6x")
            h4.is-size-4(style="margin-top: 3rem;") Nothing Here
      template(v-slot:default="props")
        b-table-column(label="Collection")
          .media
            .media-left
              nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'collections-id', params: { id: props.row.uid }}")
                img(v-if="props.row.cover" :src="props.row.cover.thumbnail")
            .media-content
              .content
                h4(v-text="props.row.title")
                p.is-size-7.has-text-grey ID: {{ props.row.uid }}
              ul.action-buttons
                li: nuxt-link(:to="{name: 'collections-id-manage', params: { id: props.row.uid }}")
                  font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
        b-table-column(field="state" label="State") {{ props.row.state }}
        b-table-column(field="levelCount" label="Levels") {{ props.row.levelCount }}
</template>

<script>
import gql from 'graphql-tag'
import { handleErrorBlock } from '../../plugins/antd'

export default {
  name: 'StudioCollections',
  data() {
    return {
      collections: [],
      createNewLoading: false,
      form: {
        uid: '',
        title: '',
      }
    }
  },
  async asyncData({ app, error }) {
    let collections = await app.apolloProvider.defaultClient.query({
      query: gql`query FetchUserCollections {
        my {
          collections {
            id
            uid
            title
            slogan
            description
            state
            levelCount
            cover {
              thumbnail
            }
          }
        }
      }`,
      variables: { }
    }).then(({ data }) => data && data.my && data.my.collections)
      .catch(err => handleErrorBlock(err, error))
    if (!collections) {
      collections = []
    }
    return { collections }
  },
  methods: {
    createNew() {
      this.createNewLoading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioCreateCollection($data: CollectionInput!) {
          createCollection(input: $data) {
            id
            uid
          }
        }`,
        variables: {
          data: this.form,
        },
      })
        .then((collection) => {
          this.$router.push({ name: 'collections-id-manage', params: { id: collection.data.createCollection.uid } })
        })
        .catch((error) => {
          this.handleErrorToast(error)
        })
        .then(() => {
          this.createNewLoading = false
        })
    },
  }
}
</script>

<style>
.studio-table table {
  width: 100%;
}
</style>
