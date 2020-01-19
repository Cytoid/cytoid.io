<template lang="pug">
.container(v-if="collection")
  section.section.header-container
    h1.text-ele(v-text="collection.title")
    h3.text-ele(v-text="collection.brief")
    div(v-html="formattedDescriptions")
  section.section.level-card-container.large
    level-card(v-for="level in collection.levels" :key="level.id" :value="level")
</template>

<script>
import marked from 'marked'
import gql from 'graphql-tag'
import { handleErrorBlock } from '@/plugins/antd'
import LevelCard from '@/components/level/LevelCard'

const query = gql`query FetchCollection($uid: String!) {
  collection(uid: $uid) {
    id
    uid
    title
    brief
    description
    creationDate
    modificationDate
    tags
    state
    coverPath
    owner {
      id
      uid
      name
      avatarURL
    }
    levels {
      id
      uid
      title
      owner {
        id
        uid
        name
        avatarURL
      }
      bundle {
        background: backgroundImage
      }
    }
    metadata {
      cover {
        artist
        source
      }
    }
  }
}`
export default {
  layout: 'background',
  name: 'Collection',
  components: { LevelCard },
  data() {
    return {
      collection: null
    }
  },
  computed: {
    formattedDescriptions() {
      return marked(this.collection.description)
    }
  },
  async asyncData({ params, error, app, store }) {
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
  }
}
</script>

<style lang="less" scoped>
.header-container {
  margin-top: 256px;
}
</style>
