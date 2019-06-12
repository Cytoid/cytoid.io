<template lang="pug">
  .section: .container: .columns
    .column.is-one-quarter
      aside.menu
        ul.menu-list
          li: nuxt-link(:to="{name: 'levels-id-manage-analytics'}")
            font-awesome-icon(:icon="['far', 'analytics']" fixed-width)
            span.menu-text Analytics
          li: nuxt-link(:to="{name: 'levels-id-manage-listing'}")
            font-awesome-icon(:icon="['far', 'chart-network']" fixed-width)
            span.menu-text Details
          li: nuxt-link(:to="{name: 'levels-id-manage-editor'}")
            font-awesome-icon(:icon="['far', 'archive']" fixed-width)
            span.menu-text Editor
    .column.is-three-quarters: nuxt
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
    background-color: #FFE53B;
    background-image: linear-gradient(147deg, #FFE53B 0%, #FF2525 74%);
  }
}
</style>
