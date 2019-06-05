<template lang="pug">
.search-input
  font-awesome-icon(:icon="['far', 'search']").icon
  input(type="search")
</template>

<script>
export default {
}
</script>

<style lang="scss">
$search-input-size: 2rem;
.search-input {
  position: relative;
  .icon {
    position: absolute;
    height: $search-input-size;
    width: $search-input-size;
    padding: $search-input-size / 4;
    pointer-events: none;
    right: 0;
  }
  input {
    background-color: $shade4;
    &:hover {
      background-color: $shade5;
    }
    display: block;
    margin-left: auto;
    height: $search-input-size;
    border: none;
    border-radius: $search-input-size / 2;
    padding-left: $search-input-size / 2;
    padding-right: $search-input-size;
    width: 100%;
    @include mobile {
      &:not(:focus) {
        width: 0;
        padding-left: $search-input-size / 2;
        padding-right: $search-input-size / 2;
        cursor: pointer;
        background-color: $primary;
      }
    }

    transition: all 0.25s ease-in-out;
  }
}

</style>
