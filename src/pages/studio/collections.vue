<template lang="pug">
.section
  .heading Create a new collection
  .box
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
        empty-placeholder
      template
        b-table-column(v-slot="props" label="Collection")
          .media
            .media-left
              nuxt-link.image.is-studio-table-thumbnail(:to="{name: 'collections-id', params: { id: props.row.uid }}")
                img(v-if="props.row.cover" :src="props.row.cover.thumbnail")
            .media-content
              h4(v-text="props.row.title")
              p.is-size-7 ID: {{ props.row.uid }}
              ul.action-buttons
                li: nuxt-link(:to="{name: 'collections-id-manage', params: { id: props.row.uid }}")
                  font-awesome-icon(:icon="['fas', 'suitcase']" fixed-width)
                li: a(@click="openDeleteModal(props.row)")
                  font-awesome-icon(:icon="['fas', 'trash']" fixed-width)
        b-table-column(v-slot="props" field="state" label="State") {{ props.row.state }}
        b-table-column(v-slot="props" field="levelCount" label="Levels") {{ props.row.levelCount }}
</template>

<script>
import EmptyPlaceholder from '@/components/EmptyPlaceholder'
import gql from 'graphql-tag'
import { handleErrorBlock } from '../../plugins/antd'

export default {
  name: 'StudioCollections',
  components: {
    EmptyPlaceholder,
  },
  async asyncData ({ app, error }) {
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
  data () {
    return {
      collections: [],
      createNewLoading: false,
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
    openDeleteModal (collection) {
      this.$buefy.dialog.confirm({
        title: 'Deleting ' + (collection.title || collection.uid),
        message: 'Are you sure you want to delete this collection?',
        confirmText: 'Delete Collection',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteCollection(collection),
      })
    },
    deleteCollection (collection) {
      this.$apollo.mutate({
        mutation: gql`mutation StudioDeleteCollection($id: ID!) {
          deleteCollection(id: $id) {
            id
          }
        }`,
        variables: {
          id: collection.id
        },
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Collection Deleted',
            type: 'is-warning'
          })
          const index = this.collections.indexOf(collection)
          if (index !== -1) {
            this.collections.splice(index, 1)
          }
        })
        .catch(this.handleErrorToast)
    }
  }
}
</script>

<style>
.studio-table table {
  width: 100%;
}
</style>
