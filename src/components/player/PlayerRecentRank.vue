<template lang="pug" functional>
  div(
    class="recent-rank ele3"
    :class="['gold', 'silver', 'bronze'][props.value.rank]"
    style="position: relative; margin-top: 8px;"
  )
    .recent-rank-background(
      v-if="props.value.chart.level.bundle.backgroundImage.stripe"
      :style="{ 'background-image': 'url(' + props.value.chart.level.bundle.backgroundImage.stripe + ')', 'background-size': 'cover' }"
    )
    .recent-rank-overlay
    div(v-if="props.showPlayer" style="margin-bottom: 8px; width: 100%; position: relative; z-index: 2;")
      nuxt-link.profile-link(
        :to="{name: 'profile-id', params: { id: props.value.owner.uid || props.value.owner.id }}"
      )
        avatar(:size="24" fixed :source="props.value.owner.avatar.small" style="margin-right: 8px;")
        span(v-text="props.value.owner.name || props.value.owner.uid")
    div(style="display: flex; margin-bottom: 8px; position: relative; z-index: 2;")
      span(
        :style="{ 'font-weight': (props.value.rank !== null) && (props.value.rank <= 3) ? 'bold' : 'normal' }"
      ) {{ '#' + props.value.rank }}
      nuxt-link(:to="{ name: 'levels-id', params: { id: props.value.chart.level.uid }}" style="margin-left: 4px;" v-text="props.value.chart.level.title")
    div(style="display: flex; position: relative; z-index: 2;")
      div(style="display: flex; font-size: 12px;")
        difficulty-badge(:value="props.value.chart" :small="true")
        score-badge(:value="props.value.score" style="margin-left: 4px;")
      div(style="display: flex; margin-left: auto;")
        span.card-secondary-text(style="font-size: 12px; padding-top: 1px;" v-text="parent.$dateFromNow(props.value.date)")
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true,
    },
    showPlayer: {
      type: Boolean,
      default: () => false
    }
  },
}
</script>

<style lang="scss">
  .recent-rank {
    position: relative;
    border-radius: 4px;
    border-left: 4px solid $theme5;
    margin: 8px -8px;
    padding: 12px 24px 16px;
    transition: 0.2s $hoverEasing;
    overflow: hidden;

    &:hover {
      border-left: 4px solid $theme6;
    }

    &:hover .recent-rank-background {
      transform: scale(1.05, 1.05);
    }
  }

  .recent-rank.gold {
    border-left: 4px solid $gold-record;

    &:hover {
      border-left: 4px solid $gold-record;
    }
  }

  .recent-rank.silver {
    border-left: 4px solid $silver-record;

    &:hover {
      border-left: 4px solid $silver-record;
    }
  }

  .recent-rank.bronze {
    border-left: 4px solid $bronze-record;

    &:hover {
      border-left: 4px solid $bronze-record;
    }
  }

  .recent-rank-background {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: 0.2s $hoverEasing;
  }

  .recent-rank-overlay {
    @extend .recent-rank-background;
    background-color: rgba(0, 0, 0, 0.8);
  }
</style>
