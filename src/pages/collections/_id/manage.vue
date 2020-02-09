<template lang="pug">
.section: .container
  form.box(v-if="collection")
    b-field(label="Title")
      b-input(v-model="collection.title")
    b-field(label="Slogan")
      b-input(v-model="collection.slogan")
    b-field(label="Description")
      client-only: markdown-editor(v-model="collection.description")
    b-field(label="Tags")
      tag-input(v-model="collection.tags")
    b-field(label="Cover image")
      resource-upload(type="covers" accept="image/*" v-model="collection.coverPath" background)
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
</template>

<script>
import gql from 'graphql-tag'
import { handleErrorBlock } from '../../../plugins/antd'
import ResourceUpload from '@/components/ResourceUpload'
import TagInput from '@/components/TagInput'
import VisibilitySelect from '@/components/studio/VisibilitySelect'
const query = gql`query FetchCollection($uid: String!) {
  collection(uid: $uid) {
    id
    uid
    title
    slogan
    description
    tags
    state
    coverPath
    levels {
      id
      uid
      title
    }
    metadata {
      cover {
        name
        url
      }
    }
  }
}`
export default {
  name: 'CollectionManagement',
  components: {
    ResourceUpload,
    TagInput,
    VisibilitySelect,
  },
  data() {
    return {
      collection: null,
      levelUidCandidates: [],
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
    store.commit('setBackground', { source: collection.coverPath })
    return { collection }
  },
  methods: {
    levelTyping(key) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(this.searchLevels.bind(this, key), 500)
    },
    searchLevels(key) {
      this.$axios.get('/tags/levels/', { params: { search: key } })
        .then((res) => {
          this.levelUidCandidates = res.data
        })
    }
  }
}
</script>
