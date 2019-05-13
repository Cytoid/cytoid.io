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
            <span class="card-secondary-text">{{ ratings.average }} ({{ ratings.total }})</span>
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
        <a-card>
          <a-table
            :columns="columns"
            :row-key="record => record.id"
            :data-source="rankings"
            :pagination="rankings_pagination"
            :loading="rankings_loading"
            :scroll="{ x: 1800 }"
            @change="handleTableChange"
          >
            <template slot="rank" slot-scope="text">
              #{{ text }}
            </template>
            <template slot="owner" slot-scope="text">
              <div class="player-avatar">
                <nuxt-link :to="'/profile/' + text">
                  <a-avatar :size="24" src="https://cytoid.io/api/avatar.php?size=64&id=tigerhix" />
                  <span v-text="'tigerhix'" class="player-avatar-name"></span>
                </nuxt-link>
              </div>
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
    width: 30,
    scopedSlots: {
      customRender: 'rank'
    }
  },
  {
    title: 'Player',
    dataIndex: 'ownerId',
    width: 200,
    scopedSlots: {
      customRender: 'owner'
    }
  },
  {
    title: 'Grade',
    width: 100,
  },
  {
    title: 'Score',
    dataIndex: 'score',
    width: 160,
  },
  {
    title: 'Accuracy',
    dataIndex: 'accuracy',
    width: 120,
  },
  {
    title: 'Max combo',
    dataIndex: 'details.max_combo',
    width: 120,
  },
  {
    title: 'Distribution',
    width: 300,
  },
  {
    title: 'Mods',
    dataIndex: 'mods',
    width: 300,
  },
  {
    title: 'Achieved',
    dataIndex: 'date',
    width: 300,
  },
]
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
    columns
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
        console.log(data)
        const pagination = { ...this.rankings_pagination }
        // Read total count from server
        // pagination.total = data.totalCount;
        pagination.total = 200
        this.rankings_loading = false
        this.rankings = data.data
        this.rankings_pagination = pagination
      })
    }
  }
}
</script>

<style scoped>
  .player-avatar {
    display: inline-block;
    transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .player-avatar:hover {
    transform: scale(1.04, 1.04);
  }
  .player-avatar:active {
    transform: scale(0.98, 0.98);
  }
  .player-avatar a {
    color: white;
    text-decoration: none !important;
  }
  .player-avatar-name {
    margin-left: 4px;
    font-size: 14px;
  }
  .row-max {
    background: orange;
    color: black;
  }
</style>
