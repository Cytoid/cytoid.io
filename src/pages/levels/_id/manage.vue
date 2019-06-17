<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'levels-id-manage-analytics'}")
            font-awesome-icon(:icon="['far', 'analytics']" fixed-width)
            span.menu-text Analytics
          li: nuxt-link(:to="{name: 'levels-id-manage-details'}")
            font-awesome-icon(:icon="['far', 'chart-network']" fixed-width)
            span.menu-text Details
          li: nuxt-link(:to="{name: 'levels-id-manage-editor'}")
            font-awesome-icon(:icon="['far', 'archive']" fixed-width)
            span.menu-text Editor
    .column.is-three-quarters: nuxt
</template>

<script>
export default {
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
.menu-text {
  font-size: 14px;
  font-weight: normal;
  margin-left: 8px;
}
a.is-active .menu-text {
  font-weight: bold;
}
.menu-list {
  li {
    margin-bottom: 8px;
  }
  a {
    padding: 12px 16px;
  }
  a.is-active {
    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(209,14,134,1) 0%, rgba(234,55,59,0.76) 90.8% );
    box-shadow: @ele4;
  }
}
</style>
