<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'studio-analytics'}")
            font-awesome-icon(:icon="['fas', 'analytics']" fixed-width)
            span.menu-text(v-t="'menu_analytics'")
          li: nuxt-link(:to="{name: 'studio-levels'}")
            font-awesome-icon(:icon="['fas', 'chart-network']" fixed-width)
            span.menu-text(v-t="'menu_levels'")
          li: nuxt-link(:to="{name: 'studio-collections'}")
            font-awesome-icon(:icon="['fas', 'archive']" fixed-width)
            span.menu-text(v-t="'menu_collections'")
    .column.is-three-quarters: nuxt-child
</template>

<script>
export default {
  middleware: 'auth',
  fetch({ route, redirect }) {
    if (route.fullPath === '/studio') {
      redirect('/studio/levels')
    }
  },
  head() {
    const user = this.$store.state.user
    const name = user?.name || user?.uid || 'Unknown'
    return {
      title: name + "'s Studio - Cytoid"
    }
  },
  i18n: {
    key: 'studio'
  }
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
    background: linear-gradient(to right, @theme4, @theme5);
    box-shadow: @ele4;
  }
}
</style>
