<template>
  <div class="container" style="margin-top: 256px;">
    <h1 style="margin-bottom: 0;" v-text="level.metadata.title" />
    <p style="font-size: 16px; margin-bottom: 16px;" v-text="level.metadata.artist.name" />
    <div style="margin-bottom: 48px;">
      <difficulty-badge :difficulty="{ type: 'easy', name: 'Easy', level: 6 }" />
      <difficulty-badge :difficulty="{ type: 'hard', name: 'Hard', level: 12 }" />
      <difficulty-badge :difficulty="{ type: 'extreme', name: 'EX', level: 17 }" />
    </div>
    <div style="margin-bottom: 32px;">
      <a-button type="primary" icon="download" size="large">
        Download (10.2MB)
      </a-button>
    </div>
    <a-card>
      <player-avatar></player-avatar>
      <div style="margin-bottom: 32px;">
        <a-rate :defaultValue="4.5" allowHalf />
        4.5 (273)
      </div>
      <div style="margin-bottom: 32px;">
        <a-tag v-for="tag in level.tags" :key="tag">
          {{ tag }}
        </a-tag>
      </div>
    </a-card>
  </div>
</template>

<script>
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayerAvatar from '@/components/player/PlayerAvatar'
export default {
  components: { PlayerAvatar, DifficultyBadge },
  data: () => ({
    level: null,
    defaultDifficulty: {
      type: 'extreme',
      name: 'EX',
    }
  }),
  asyncData({ $axios, params }) {
    return $axios.get('/levels/' + params.id)
      .then(response => ({
        level: response.data
      }))
  },
  mounted() {
    this.$root.$emit('background', { source: this.level.bundle.background })
  }
}
</script>
