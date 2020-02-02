<template lang="pug">
.collection-dock.columns
  .collection-dock-intro.column.is-one-third-desktop.is-two-fifths-tablet
    .collection-intro-bg(
      v-if="value.coverPath"
      :style="{ backgroundImage: `url(${$img(value.coverPath, { height: 500 })})` }")
    .collection-intro-content
      .content
        h1.collection-title(v-text="value.title")
        p.collection-slogan(v-text="value.slogan")
      .card-bottom
        nuxt-link.profile-link(
          v-if="value.owner"
          :to="{name: 'profile-id', params: { id: value.owner.uid || value.owner.id }}"
        )
          avatar(:size="24" fixed :src="value.owner.avatarURL" style="margin-right: 8px;")
          span(v-text="value.owner.name || value.owner.uid")
  .column.collection-dock.scroll-container
    .collection-dock-levels
      .collection-dock-card(v-for="level in value.levels" :key="level.id")
        level-card(:value="level")
      .collection-dock-card(style="width: 180px;")
        .collection-dock-more-card
          font-awesome-icon(icon="plus").collection-dock-more-card-icon
          nuxt-link(:to="{ name: 'collections-id', params: { id: value.uid } }")
            a-button.card-button More
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
  margin: 0;
  .collection-dock-intro {
    position: relative;
    overflow: hidden;
    .collection-intro-bg {
      opacity: 0.5;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .collection-intro-content {
      position: relative;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      .content {
        flex-grow: 1;
        .collection-title {
          font-size: 24px;
          font-weight: 300;
          text-overflow: ellipsis;
          white-space: nowrap;
          user-select: none;
        }
        .collection-slogan {
          color: rgba(255, 255, 255, 0.7);
          text-overflow: ellipsis;
          white-space: nowrap;
          user-select: none;
        }
      }
      .card-bottom {
        position: relative;
      }
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
      .collection-dock-more-card {
        width: 100%;
        height: 100%;
        background: @shade4;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .collection-dock-more-card-icon {
          height: 64px;
          width: 64px;
          padding: 16px;
        }
      }
    }
  }
}
</style>
