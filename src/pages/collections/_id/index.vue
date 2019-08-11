<template lang="pug">
.container
  section.section.header-container
    h1.text-ele(v-text="value.title")
    h3.text-ele(v-text="value.brief")
    div(v-html="formattedDescriptions")
  section.section.level-card-container.large
    level-card(v-for="level in value.levels" :key="level.id" :value="level")
</template>

<script>
import marked from 'marked'
import LevelCard from '@/components/level/LevelCard'
export default {
  layout: 'background',
  name: 'Collection',
  components: { LevelCard },
  data() {
    return {
      value: null
    }
  },
  computed: {
    formattedDescriptions() {
      return marked(this.value.description)
    }
  },
  asyncData({ $axios, params, error, store }) {
    return $axios.get('/collections/' + params.id)
      .then((response) => {
        store.commit('setBackground', { source: response.data.coverURL })
        return {
          value: response.data
        }
      })
  }
}
</script>

<style lang="less" scoped>
.header-container {
  margin-top: 256px;
}
</style>
