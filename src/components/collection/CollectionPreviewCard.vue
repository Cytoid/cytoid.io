<template lang="pug">
.collection-dock.columns
  nuxt-link.collection-dock-intro.column.is-one-third-desktop(
    :style="value.coverURL && { backgroundImage: `url(${$img(value.coverURL, { height: 500 })})` }"
    :to="{ name: 'collections-id', params: { id: value.uid } }"
  )
    h1(v-text="value.title")
    h3(v-text="value.brief")
  .column.collection-dock.scroll-container
    .collection-dock-levels
      .collection-dock-card(v-for="level in value.levels" :key="level.id")
        level-card(:value="level")
</template>

<script>
import LevelCard from '../level/LevelCard'
export default {
  name: 'CollectionPreviewCard',
  components: {
    LevelCard
  },
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
}
</script>

<style lang="less">
.collection-dock {
  background: @component-background;
  border-radius: 6px;
  overflow: hidden;
  .collection-dock-intro {
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    h1 {
      font-size: 32px;
    }
  }
  .collection-dock {
    overflow-x: scroll;
    .collection-dock-levels {
      display: flex;
      flex-direction: row;
      .collection-dock-card {
        width: 360px;
        flex-shrink: 0;
        padding: 10px;
      }
    }
  }
}
</style>
