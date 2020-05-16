<template lang="pug">
.section: .container
  form.box(v-if="collection" @submit.prevent="save")
    b-field(label="Title")
      b-input(v-model="collection.title")
    b-field(label="Slogan")
      b-input(v-model="collection.slogan")
    b-field(label="Description")
      client-only: markdown-editor(v-model="collection.description")
    b-field(label="Tags")
      tag-input(v-model="collection.tags")
    b-field(label="Visibility" :addons="false")
      visibility-select(:value="collection.state" @change="collection.state = $event")
    b-field(label="Cover image")
      upload(:background="collection.cover && collection.cover.thumbnail" type="covers" @upload="coverUploaded")
    meta-field(label="Cover artist" :value="collection.metadata.cover" @input="metaFieldInput")
    b-field(label="Levels" message="Type the level UIDs here")
      b-taginput(
        v-model="collection.levels"
        autocomplete
        :allow-new="false"
        :data="levelUidCandidates"
        @typing="levelTyping"
        field="title")
        template(v-slot:default="slotProps")
          span {{slotProps.option.uid}}({{slotProps.option.title}})
    b-button(native-type="submit" :loading="loading") Save
</template>

<script>
import gql from 'graphql-tag'
import Upload from '@/components/Upload'
import TagInput from '@/components/TagInput'
import VisibilitySelect from '@/components/studio/VisibilitySelect'
import { handleErrorBlock } from '@/plugins/antd'
import MetaField from '@/components/MetaField'
const query = gql`query FetchCollection($uid: String!) {
  collection(uid: $uid) {
    id
    uid
    title
    slogan
    description
    tags
    state
    cover {
      thumbnail
    }
    owner {
      id
    }
    levels {
      id
      uid
      title
    }
    metadata {
      cover {
        name
        localized_name
        url
      }
    }
  }
}`
export default {
  name: 'CollectionManagement',
  components: {
    Upload,
    TagInput,
    VisibilitySelect,
    MetaField,
  },
  data() {
    return {
      collection: null,
      levelUidCandidates: [],
      loading: false,
    }
  },
  async asyncData({ app, params, error, store }) {
    const collection = await app.apolloProvider.defaultClient.query({
      query,
      variables: { uid: params.id }
    }).then(({ data }) => data && data.collection)
      .catch(err => handleErrorBlock(err, error))
    if (!collection) {
      return error({ statusCode: 404, message: 'Collection not found' })
    }
    const user = store.state.user
    if (collection.owner.id !== user?.id && !(user?.role === 'admin' || user?.role === 'moderator')) {
      error({ statusCode: 403, message: "You don't have the permission to edit this collection!" })
      return
    }
    store.commit('setBackground', { source: collection.coverPath })
    return { collection }
  },
  methods: {
    metaFieldInput(str, property) {
      if (!this.collection.metadata.cover) {
        this.collection.metadata.cover = {}
      }
      this.collection.metadata.cover[property] = str
    },
    levelTyping(key) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(this.searchLevels.bind(this, key), 500)
    },
    searchLevels(key) {
      this.$axios.get('/search/level_uids', { params: { search: key } })
        .then((res) => {
          this.levelUidCandidates = res.data
        })
    },
    coverUploaded(path) {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation StudioUpdateCollectionForCover($id: ID!, $data: CollectionInput!) {
          collection: updateCollection(id: $id, input: $data) {
            id
            cover {
              thumbnail
            }
          }
        }`,
        variables: {
          id: this.collection.id,
          data: {
            coverPath: path,
          },
        },
      })
        .then((res) => {
          const thumbnailURL = res.data.collection?.cover?.thumbnail
          if (!this.collection.cover) {
            this.collection.cover = { thumbnail: thumbnailURL }
          } else {
            this.collection.cover.thumbnail = thumbnailURL
          }
          this.$buefy.toast.open({
            message: 'Collection Cover Updated',
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
        mutation: gql`mutation StudioUpdateCollection($id: ID!, $data: CollectionInput!) {
          updateCollection(id: $id, input: $data) {
            id
          }
        }`,
        variables: {
          id: this.collection.id,
          data: {
            uid: this.collection.uid,
            title: this.collection.title,
            slogan: this.collection.slogan,
            description: this.collection.description,
            levelIds: this.collection.levels.map(l => l.id),
            tags: this.collection.tags,
            coverPath: this.collection.coverPath,
            state: this.collection.state,
            metadata: {
              cover: {
                name: this.collection.metadata.cover.name,
                localized_name: this.collection.metadata.cover.localized_name,
                url: this.collection.metadata.cover.url,
              }
            }
          },
        },
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Collection Saved',
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
