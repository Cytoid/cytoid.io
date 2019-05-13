<template>
  <div class="container" style="margin-top: 256px;">
    <h1 style="margin-bottom: 0;" v-text="level.metadata.title" />
    <p style="font-size: 16px; margin-bottom: 16px;" v-text="level.metadata.artist.name" />
    <div style="margin-bottom: 48px;">
      <difficulty-badge v-for="chart in level.charts" :key="chart.id" :value="chart" />
    </div>
    <div style="margin-bottom: 32px;">
      <a-button type="primary" icon="download" size="large">
        Download (10.2MB)
      </a-button>
    </div>
    <a-row :gutter="16">
      <a-col :xs="24" :lg="8">
        <a-card style="margin-bottom: 16px;">
          <player-avatar style="margin-bottom: 16px;"></player-avatar>
          <p>This is a test description!</p>
          <!-- TODO: Marked -->
          <p class="card-heading">Rating</p>
          <div style="margin-bottom: 16px;">
            <a-rate :defaultValue="4.5" allowHalf />
            <span class="card-secondary-text">4.5 (273)</span>
          </div>
          <p class="card-heading">Tags</p>
          <div style="margin-bottom: 16px;">
            <a-tag v-for="tag in level.tags" :key="tag">
              {{ tag }}
            </a-tag>
          </div>
          <p class="card-heading">Last updated</p>
          <div class="card-secondary-text" style="margin-bottom: 0px;">
            {{ readableDate(level.modificationDate) }}
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="16">
        <a-card>
          Rankings
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
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
  },
  methods: {
    readableDate: function (date) {
      return moment(date).fromNow()
    }
  }
}
</script>
