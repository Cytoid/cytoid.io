<template lang="pug">
  div
    a-card.ele3
      p.heading Description
      markdown-editor(v-model="description" ref="markdownEditor")
    a-card.ele3 Most played levels
    a-card.ele3 Latest comments
</template>

<script>

export default {
  name: 'LevelManageListing',
  layout: 'background',
  data: function () {
    return {
      description: 'Hi'
    }
  },
  asyncData({ $axios, params, store }) {
    return Promise.all([
      $axios.get('/levels/' + params.id),
      $axios.get(`/levels/${params.id}/ratings`)
    ])
      .then(([levelResponse, ratingResponse]) => {
        store.commit('setBackground', { source: levelResponse.data.bundle.background })
        return {
          level: levelResponse.data,
          ratings: ratingResponse.data,
        }
      })
  },
  mounted() {

  }
}
</script>

<style lang="less" scoped>
  .ant-card {
    margin-bottom: 16px;
  }
</style>
