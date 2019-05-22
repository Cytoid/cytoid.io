<template lang="pug">
header.navbar(role="navigation")
  .container
    .navbar-brand
      slot(name="brand")
      .navbar-burger(@click="expanded = !expanded" :class="{ 'is-active': expanded }")
        span
        span
        span
      .navbar-append.is-brand
        slot(name="append")
    .navbar-menu(:class="{ 'is-active': expanded }")
      .navbar-start
        slot(name="start")
      .navbar-end
        slot(name="end")
    .navbar-append.is-end
      slot(name="append")
</template>

<script>
export default {
  data: () => ({
    expanded: false,
  })
}
</script>

<style lang="scss">
@import "~bulma/sass/components/navbar";
.navbar-append {
  display: flex;
  align-items: stretch;
  &.is-brand {
    @include from($navbar-breakpoint) {
      .navbar-item,
      .navbar-link {
        display: none
      }
    }
  }
  &.is-end {
    @include until($navbar-breakpoint) {
      .navbar-item,
      .navbar-link {
        display: none;
      }
    }
  }
}
</style>
