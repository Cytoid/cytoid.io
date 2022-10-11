<template lang="pug">
.qualified-dock.columns
  .qualified-dock-intro.column.is-one-third-desktop.is-two-fifths-tablet
    .qualified-intro-bg(
      v-if="value.cover"
      :style="{ background: 'green' }")
    .qualified-intro-content
      .qualified-intro-content-top
        h1.title(v-t="'qualified_collection_title'")
        p.subtitle(v-t="'qualified_collection_slogan'")
      .qualified-intro-content-bottom
        //- nuxt-link.profile-link(
        //-   v-if="value.owner"
        //-   :to="{name: 'profile-id', params: { id: value.owner.uid || value.owner.id }}"
        //- )
        //-   avatar(:size="24" fixed :src="value.owner.avatarURL" style="margin-right: 8px;")
        //-   span(v-text="value.owner.name || value.owner.uid")
  .column.qualified-dock.scroll-container
    .qualified-dock-levels
      .qualified-dock-card(v-for="level in value" :key="level.id")
        level-card(:value="level")
      .qualified-dock-card(style="width: 180px;")
        .qualified-dock-more-card
          font-awesome-icon(icon="plus").qualified-dock-more-card-icon
          nuxt-link(:to="{ name: 'levels', query: { qualified: true, category: 'qualified', sort: 'creation_date', order: 'desc' } }")
            button.button.is-white(v-t="'more_btn'")
</template>

<script>
import LevelCard from './level/LevelCard'
export default {
  name: 'QualifiedPreviewCard',
  components: {
    LevelCard
  },
  props: {
    value: {
      type: Object,
      required: true,
    }
  },
  i18n: {
    key: 'homepage'
  }
}
</script>

<style lang="scss">
.qualified-dock {
  --box-background-gradient: linear-gradient(to right bottom, #4a9386, #8d95bb);
  background: radial-gradient(circle farthest-corner at 0 0, transparent, #292d38 40%), var(--box-background-gradient, linear-gradient(to right bottom, #acb6e5, #86fde8));
  border-radius: 6px;
  overflow: hidden;
  margin: 0;
  .scroll-container {
    background: none;
  }
  .qualified-dock-intro {
    position: relative;
    overflow: hidden;
    .qualified-intro-bg {
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
    .qualified-intro-content {
      position: relative;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      height: 100%;
      .qualified-intro-content-top {
        flex-grow: 1;
      }
      .qualified-intro-content-bottom {
        position: relative;
      }
    }
  }
  .qualified-dock {
    overflow-x: scroll;
    .qualified-dock-levels {
      display: flex;
      flex-direction: row;
      .qualified-dock-card {
        width: 360px;
        flex-shrink: 0;
        padding: 10px;
      }
      .qualified-dock-more-card {
        width: 100%;
        height: 100%;
        background: $grey-light;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .qualified-dock-more-card-icon {
          height: 64px;
          width: 64px;
          padding: 16px;
        }
      }
    }
  }
}
</style>
