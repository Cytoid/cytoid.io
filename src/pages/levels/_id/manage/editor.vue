<template lang="pug">
  div
    a-card Plays & Downloads
    a-card Most played levels
    a-card Latest comments
</template>

<script>
export default {
  name: 'LevelManageEditor',
  layout: 'background',
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
}
</script>

<style lang="less" scoped>
  .ant-card {
    margin-bottom: 16px;
  }
</style>
