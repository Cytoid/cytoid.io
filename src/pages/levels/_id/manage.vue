<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'levels-id-manage-analytics'}")
            font-awesome-icon(:icon="['fas', 'analytics']" fixed-width)
            span.menu-text Analytics
          li: nuxt-link(:to="{name: 'levels-id-manage-listing'}")
            font-awesome-icon(:icon="['fas', 'edit']" fixed-width)
            span.menu-text Edit listing
          li: nuxt-link(:to="{name: 'levels-id-manage-level'}")
            font-awesome-icon(:icon="['fas', 'file-edit']" fixed-width)
            span.menu-text Edit level
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
    color: rgba(255, 255, 255, 0.5);
    background-color: transparent;
    transition: 0.4s @hoverEasing;
    &:hover {
      color: rgba(255, 255, 255, 1);
      background-color: hsla(226, 15%, 19%, 0.3);
    }
  }
  a.is-active {
    color: rgba(255, 255, 255, 1);
    background-image: radial-gradient( circle farthest-corner at 10% 20%,  rgba(209,14,134,1) 0%, rgba(234,55,59,0.76) 90.8% );
    box-shadow: @ele4;
  }
}
</style>
