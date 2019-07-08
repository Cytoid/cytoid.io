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
    .column.is-three-quarters: nuxt-child(v-if="level" :value="level")
</template>

<script>
import { handleErrorBlock } from '@/plugins/antd'
export default {
  layout: 'background',
  middleware: 'auth',
  data() {
    return {
      level: null,
    }
  },
  asyncData({ $axios, params, store, error }) {
    return $axios.get('/levels/' + params.id)
      .then((res) => {
        const level = res.data
        if (level.owner.id !== store.state.user?.id) {
          error({ statusCode: 403, message: "You don't have the permission to edit this level!" })
          return
        }
        store.commit('setBackground', { source: level.bundle.background })
        return { level }
      })
      .catch(err => handleErrorBlock(err, error))
  },
  fetch({ route, redirect }) {
    const test = /^\/levels\/(.+)\/manage$/.exec(route.fullPath)
    if (test) {
      return redirect(route.fullPath + '/level')
    }
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
    transition: 0.2s @hoverEasing;
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
