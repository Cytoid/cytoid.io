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
          <player-avatar style="margin-bottom: 16px;" />
          <p v-html="levelDescription" />
          <p class="card-heading">Rating</p>
          <div style="margin-bottom: 16px;">
            <a-rate
              :default-value="(ratings.rating || ratings.average) * 0.5"
              allow-half
              :disabled="!ratings.rating"
              @change="rate"
            />
            <span class="card-secondary-text">{{ (Math.floor(ratings.average * 0.5 * 100) / 100).toFixed(2) }} ({{ ratings.total }})</span>
          </div>
          <p class="card-heading">
            Tags
          </p>
          <div style="margin-bottom: 16px;">
            <a-tag v-for="tag in level.tags" :key="tag">
              {{ tag }}
            </a-tag>
          </div>
          <p class="card-heading">
            Last updated
          </p>
          <div class="card-secondary-text" style="margin-bottom: 0px;">
            {{ readableDate(level.modificationDate) }}
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="16">
        <a-card style="margin-bottom: 16px;">
          <a-table
            :columns="columns"
            :row-key="record => record.id"
            :data-source="rankings"
            :pagination="rankings_pagination"
            :loading="rankings_loading"
            :scroll="{ x: 800 }"
            :rowClassName="(record, index) => rowClass(record, index)"
            @change="handleTableChange"
          >
            <template slot="rank" slot-scope="text">
              # {{ text }}
            </template>
            <template slot="owner" slot-scope="text">
              <div class="ranking-player-avatar">
                <nuxt-link :to="'/profile/' + text" style="display: flex; align-items: center;">
                  <a-avatar :size="24" src="https://cytoid.io/api/avatar.php?size=64&id=tigerhix" />
                  <span v-text="'tigerhix'" class="ranking-player-avatar-name"></span>
                </nuxt-link>
              </div>
            </template>
            <template slot="score" slot-scope="text">
              <div style="display: flex; align-items: center;">
                <a-badge :count="scoreGrade(text)" :class="scoreBadgeClass(text)" />
                <span style="margin-left: 4px;">
                  {{
                    text
                  }}
                </span>
              </div>
            </template>
            <template slot="accuracy" slot-scope="text">
              {{ (Math.floor(text * 100 * 100) / 100) + '%' }}
            </template>
            <template slot="max_combo" slot-scope="text">
              {{ text + 'x' }}
            </template>
            <template slot="mods" slot-scope="text">
              <span v-if="text.length === 0">
                N/A
              </span>
              <img v-for="mod in text" :key="mod" :title="modNames[mod.toLowerCase()]" :src="'/icons/' + mod.toLowerCase() + '.png'" style="height: 20px; padding-bottom: 2px; max-width: unset;" />
            </template>
            <template slot="achieved" slot-scope="text">
              {{ readableDate(text) }}
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayerAvatar from '@/components/player/PlayerAvatar'
const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    width: 10,
    scopedSlots: {
      customRender: 'rank'
    }
  },
  {
    title: 'Player',
    dataIndex: 'ownerId',
    width: 120,
    scopedSlots: {
      customRender: 'owner'
    }
  },
  {
    title: 'Score',
    dataIndex: 'score',
    width: 40,
    scopedSlots: {
      customRender: 'score'
    }
  },
  {
    title: 'Acc.',
    dataIndex: 'accuracy',
    width: 10,
    scopedSlots: {
      customRender: 'accuracy'
    }
  },
  {
    title: 'Max combo',
    dataIndex: 'details.max_combo',
    width: 10,
    scopedSlots: {
      customRender: 'max_combo'
    }
  },
  {
    title: 'Perfect',
    dataIndex: 'details.perfect',
    width: 10,
  },
  {
    title: 'Great',
    dataIndex: 'details.great',
    width: 10,
  },
  {
    title: 'Good',
    dataIndex: 'details.good',
    width: 10,
  },
  {
    title: 'Bad',
    dataIndex: 'details.bad',
    width: 10,
  },
  {
    title: 'Miss',
    dataIndex: 'details.miss',
    width: 10,
  },
  {
    title: 'Mods',
    dataIndex: 'mods',
    width: 10,
    scopedSlots: {
      customRender: 'mods'
    }
  },
  {
    title: 'Achieved',
    dataIndex: 'date',
    width: 80,
    scopedSlots: {
      customRender: 'achieved'
    }
  },
]
const modNames = {
  'hidenotes': 'Invisible',
  'hidescanline': 'No Scanline',
  'slow': 'Slow',
  'fast': 'Fast',
  'hard': 'HYPER',
  'exhard': 'ANOTHER',
  'ap': 'All Perfect',
  'fc': 'Full Combo',
  'flipall': 'Flip All',
  'flipx': 'Flip X',
  'flipy': 'Flip Y'
}
export default {
  components: { PlayerAvatar, DifficultyBadge },
  data: () => ({
    level: null,
    ratings: null,
    defaultDifficulty: {
      type: 'extreme',
      name: 'EX',
    },
    rankings: [],
    rankings_pagination: {},
    rankings_loading: false,
    columns,
    modNames
  }),
  computed: {
    levelDescription() {
      return marked(this.level.description || 'The author was too lazy to write some descriptions.')
    }
  },
  asyncData({ $axios, params }) {
    return Promise.all([
      $axios.get('/levels/' + params.id),
      $axios.get(`/levels/${params.id}/ratings`)
    ])
      .then(([levelResponse, ratingResponse]) => ({
        level: levelResponse.data,
        ratings: ratingResponse.data,
      }))
  },
  mounted() {
    this.$root.$emit('background', { source: this.level.bundle.background })
    this.fetchRankings()
  },
  methods: {
    readableDate(date) {
      return moment(date).fromNow()
    },
    rate(e) {
      e *= 2
      this.$axios.post(`/levels/${this.level.uid}/ratings`, { rating: e })
        .then((response) => {
          this.ratings = response.data
        })
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.rankings_pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetchRankings({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      })
    },
    fetchRankings(params = {}) {
      console.log('params:', params)
      this.rankings_loading = true
      this.$axios.get('https://api.cytoid.io/levels/tigertiger.crossfire/charts/hard/ranking', {
        params: {
          results: 10,
          ...params,
        },
        type: 'json',
      }).then((data) => {
        const pagination = { ...this.rankings_pagination }
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = 200
        this.rankings_loading = false
        this.rankings = data.data
        this.rankings_pagination = pagination
      })
    },
    scoreGrade(score) {
      if (score === 1000000) {
        return 'MAX'
      } else if (score >= 999500) {
        return 'SSS'
      } else if (score >= 990000) {
        return 'SS'
      } else if (score >= 950000) {
        return 'S'
      } else if (score >= 900000) {
        return 'A'
      } else if (score >= 800000) {
        return 'B'
      } else if (score >= 700000) {
        return 'C'
      } else if (score >= 600000) {
        return 'D'
      } else {
        return 'F'
      }
    },
    scoreBadgeClass(score) {
      if (score === 765432) {
        return 'badge-score-max'
      } else if (score >= 999500) {
        return 'badge-score-sss'
      } else {
        return 'badge-score'
      }
    },
    rowClass(record) {
      if (record.score === 765432) {
        return 'row-score-max'
      } else if (record.score >= 999500) {
        return 'row-score-sss'
      } else {
        return 'row-score'
      }
    }
  }
}
</script>

<style scoped>
  .ranking-player-avatar {
    display: flex;
    transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .ranking-player-avatar:hover {
    transform: scale(1.04, 1.04);
  }
  .ranking-player-avatar:active {
    transform: scale(0.98, 0.98);
  }
  .ranking-player-avatar a {
    text-decoration: none !important;
  }
  .ranking-player-avatar-name {
    margin-left: 8px;
    padding-bottom: 2px;
    font-size: 14px;
  }
</style>
