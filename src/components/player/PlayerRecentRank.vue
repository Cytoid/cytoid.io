<template lang="pug">
  div(
    class="recent-rank ele3"
    :class="Number(rank.rank) === 1 ? 'gold' : (Number(rank.rank) === 2 ? 'silver' : (Number(rank.rank) === 3 ? 'bronze' : ''))"
    style="position: relative; margin-top: 8px;"
  )
    .recent-rank-background(
      v-if="rank.backgroundURL"
      :style="{ 'background-image': 'url(' + $img(rank.backgroundURL, { height: 100, width: 500, mode: 'fill' }) + ')', 'background-size': 'cover' }"
    )
    .recent-rank-overlay
    div(v-if="showPlayer" style="margin-bottom: 8px; width: 100%; position: relative; z-index: 2;")
      nuxt-link.profile-link(
        :to="{name: 'profile-id', params: { id: rank.owner.uid || rank.owner.id }}"
      )
        avatar(:size="24" fixed :src="rank.owner.avatarURL" style="margin-right: 8px;")
        span(v-text="rank.owner.name || rank.owner.uid")
    div(style="display: flex; margin-bottom: 8px; position: relative; z-index: 2;")
      span(
        :style="{ 'font-weight': Number(rank.rank) <= 3 ? 'bold' : 'normal' }"
      ) {{ '#' + rank.rank }}
      nuxt-link(:to="{ name: 'levels-id', params: { id: rank.uid }}" style="margin-left: 4px;" v-text="rank.title")
    div(style="display: flex; position: relative; z-index: 2;")
      div(style="display: flex; font-size: 12px;")
        difficulty-badge(:value="{ type: rank.type, name: rank.name, difficulty: rank.difficulty, notesCount: rank.notesCount }" :small="true")
        score-badge(:value="rank.score" style="margin-left: 4px;")
      div(style="display: flex; margin-left: auto;")
        span.card-secondary-text(style="font-size: 12px; padding-top: 1px;" v-text="$dateFromNow(rank.date)")
</template>

<script>
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
export default {
  components: {
    ScoreBadge, DifficultyBadge
  },
  props: {
    rank: {
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

<style lang="less">
  .recent-rank {
    position: relative;
    border-radius: 4px;
    border-left: 4px solid @theme5;
    margin: 8px -8px;
    padding: 12px 24px 16px;
    transition: 0.2s @hoverEasing;
    overflow: hidden;

    &:hover {
      border-left: 4px solid @theme6;
    }

    &:hover .recent-rank-background {
      transform: scale(1.05, 1.05);
    }
  }

  .recent-rank.gold {
    border-left: 4px solid @gold-record;

    &:hover {
      border-left: 4px solid @gold-record;
    }
  }

  .recent-rank.silver {
    border-left: 4px solid @silver-record;

    &:hover {
      border-left: 4px solid @silver-record;
    }
  }

  .recent-rank.bronze {
    border-left: 4px solid @bronze-record;

    &:hover {
      border-left: 4px solid @bronze-record;
    }
  }

  .recent-rank-background {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transition: 0.2s @hoverEasing;
  }

  .recent-rank-overlay {
    .recent-rank-background;
    background-color: rgba(0, 0, 0, 0.8);
  }
</style>
