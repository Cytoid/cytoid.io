<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'studio-analytics'}")
            font-awesome-icon(:icon="['far', 'analytics']" fixed-width)
            span.menu-text Analytics
          li: nuxt-link(:to="{name: 'studio-levels'}")
            font-awesome-icon(:icon="['far', 'chart-network']" fixed-width)
            span.menu-text Levels
          li: a
            font-awesome-icon(:icon="['far', 'archive']" fixed-width)
            span.menu-text Collections
          li: a
            font-awesome-icon(:icon="['far', 'file-signature']" fixed-width)
            span.menu-text Posts
    .column: nuxt
</template>

<script>
export default {
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
    background: linear-gradient(to right, @theme4, @theme5);
  }
}
</style>
