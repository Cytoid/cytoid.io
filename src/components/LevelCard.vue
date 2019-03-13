<template lang="pug">
  .level-card(@click="enterLevel")
    img(:src="value.bundle.background")
    .content
      .title-block
        h1(v-text="value.title")
        h3(v-if="value.metadata.artist && value.metadata.artist.name" v-text="value.metadata.artist.name")
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  methods: {
    enterLevel() {
      this.$router.push({ name: 'levels-id', params: { id: this.value.uid } })
    }
  }
}
</script>

<style scoped lang="scss">
.level-card {
  min-height: 200px;
  min-width: 320px;
  display: inline-block;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, .05);
  color: white;
  position: relative;
  user-select: none;
  &:hover img {
    filter: brightness(70%);
  }
  &:active img {
    filter: brightness(50%);
  }
  img {
    transition: filter 0.15s linear;
    filter: brightness(60%);
    border-radius: .5rem;
    z-index: -1;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  padding: .5rem;
  .title-block {
    display: block;
    h1 {
      font-size: 25px;
      color: white;
      margin: 0;
      display: block;
    }
    small {
      font-size: 10px;
    }
    h3 {
      color: white;
      margin: 0;
      display: inline;
      font-size: 12px;
      font-weight: normal;
    }
  }
}
</style>
