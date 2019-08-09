<template lang="pug">
.section: .container
  collection-preview-card(v-for="collection in collections", :key="collection.id" :value="collection")
</template>

<script>
import CollectionPreviewCard from '@/components/collection/CollectionPreviewCard'
export default {
  name: 'CollectionList',
  components: {
    CollectionPreviewCard
  },
  data() {
    return {
      collections: []
    }
  },
  asyncData({ $axios }) {
    return $axios.get('/collections')
      .then((response) => {
        const collections = response.data
        return {
          collections
        }
      })
  }
}
</script>
