<template functional>
  <nuxt-link
    tag="li"
    class="ant-menu-item"
    role="menuitem"
    :to="props.to"
    active-class="ant-menu-item-selected"
    :exact="props.exact"
  >
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    exact: {
      type: Boolean,
      default: false,
    },
    to: {
      type: [String, Object],
      required: true
    }
  },
}
</script>

<style lang="less">
.navbar-item {
  color: rgba(255, 255, 255, 0.3);
  &.is-active {
    font-weight: bold;
  }
}
</style>
