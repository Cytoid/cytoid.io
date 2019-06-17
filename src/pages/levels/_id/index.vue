<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    h1(class="text-ele" style="margin-bottom: 16px; line-height: 1.0;" v-text="level.metadata.title")
    div(class="text-ele" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-bottom: 20px;" v-text="level.metadata.artist.name")
    div(style="margin-bottom: 48px;")
      difficulty-badge(v-for="chart in level.charts" :key="chart.id" :value="chart" class="ele3" style="margin-right: 8px;")
    div(style="margin-bottom: 32px;")
      a-button(
        type="primary"
        size="large"
        class="download-button ele3"
        @click="download"
      )
        font-awesome-icon(icon="download" fixed-width style="margin-right: 8px;")
        span Download #[span(v-if="level.packageSize") ({{formatSize(level.packageSize)}})]
    a-row(:gutter="16")
      a-col(:xs="24" :lg="8")
        a-card(class="ele2" style="margin-bottom: 16px;")
          player-avatar(style="margin-bottom: 16px;" :player="level.owner")
          div(style="overflow: auto;" v-html="levelDescription")
          p(class="card-heading") Rating
          div(style="margin-bottom: 16px;")
            a-rate(
              :default-value="(ratings.rating || ratings.average) * 0.5"
              allow-half
              :disabled="ratings.rating === undefined"
              @change="rate"
            )
            span.card-secondary-text {{ (Math.floor(ratings.average * 0.5 * 100) / 100).toFixed(2) }} ({{ ratings.total }})
          .card-heading Tags
          div(style="margin-bottom: 16px;")
            a-tag(v-for="tag in level.tags" :key="tag") {{ tag }}
          .card-heading Last updated
          .card-secondary-text(style="margin-bottom: 0px;") {{ readableDate(level.modificationDate) }}
      a-col(:xs="24" :lg="16")
        a-card(class="ele2" style="margin-bottom: 16px;")
          a-table(
            :columns="columns"
            :row-key="record => record.id"
            :data-source="rankings"
            :pagination="rankings_pagination"
            :loading="rankings_loading"
            :scroll="{ x: 800 }"
            :rowClassName="(record, index) => rowClass(record, index)"
            @change="handleTableChange"
          )
            template(v-slot:rank="ranking") {{ '#' + ranking }}
            template(v-slot:owner="owner")
              .ranking-player-avatar
                nuxt-link(to="/profile" style="display: flex; align-items: center;")
                  a-avatar(:size="24" src="https://cytoid.io/api/avatar.php?size=64&id=tigerhix")
                  span.ranking-player-avatar-name(v-text="owner.name || owner.uid")
            template(v-slot:score="score")
              div(style="display: flex; align-items: center;")
                score-badge(:value="score")
                span(style="margin-left: 4px;" v-text="score")
            template(v-slot:accuracy="accuracy") {{ (Math.floor(accuracy * 100 * 100) / 100) + '%' }}
            template(v-slot:maxcombo="maxCombo") {{ maxCombo ? (maxCombo + 'x') : 'Unknown' }}
            template(v-slot:mods="mods")
              span(v-if="mods.length === 0 || mods[0] === ''") N/A
              span(v-else)
                img(v-for="mod in mods" :key="mod" :title="modNames[mod.toLowerCase()]" :src="'/icons/' + mod.toLowerCase() + '.png'" style="height: 20px; padding-bottom: 2px; max-width: unset; margin-right: 4px;")
            template(v-slot:achieved="date" style="font-size: 12px;") {{ readableDate(date) }}
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayerAvatar from '@/components/player/PlayerAvatar'
import ScoreBadge from '@/components/level/ScoreBadge'
import { formatBytes } from '@/utils'
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
    dataIndex: 'owner',
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
    dataIndex: 'details.maxCombo',
    width: 10,
    scopedSlots: {
      customRender: 'maxcombo'
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
    scopedSlots: {
      customRender: 'mods'
    }
  },
  {
    title: 'Achieved',
    dataIndex: 'date',
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
  layout: 'background',
  components: { ScoreBadge, PlayerAvatar, DifficultyBadge },
  data: () => ({
    level: null,
    ratings: null,
    rankings: [],
    rankings_pagination: {},
    rankings_loading: false,
    columns,
    modNames
  }),
  computed: {
    levelDescription() {
      return marked(this.level.description || 'The author was too lazy to write any descriptions.')
    },
  },
  asyncData({ $axios, params, store }) {
    return Promise.all([
      $axios.get('/levels/' + params.id),
      $axios.get(`/levels/${params.id}/ratings`)
    ])
      .then(([levelResponse, ratingResponse]) => {
        store.commit('setBackground', { source: levelResponse.data.bundle.background })
        return {
          level: levelResponse.data,
          ratings: ratingResponse.data,
        }
      })
  },
  mounted() {
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
      this.fetchRankings({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      })
    },
    rowClass(record) {
      if (record.score === 1000000) {
        return 'row-score-max'
      } else if (record.score >= 999500) {
        return 'row-score-sss'
      } else {
        return 'row-score'
      }
    },
    fetchRankings(params = {}) {
      this.rankings_loading = true
      this.$axios.get(`/levels/${this.level.uid}/charts/${this.level.charts[0].type}/ranking`, {
        params: {
          results: 10,
          ...params,
        },
      }).then((res) => {
        const pagination = { ...this.rankings_pagination }
        pagination.total = res.headers['x-total-entries']
        this.rankings_loading = false
        this.rankings = res.data
        this.rankings_pagination = pagination
      })
    },
    formatSize(size) {
      return formatBytes(size)
    },
    download() {
      if (this.$auth.loggedIn) {
        window.location.href = process.env.apiURL + '/levels/' + this.level.uid + '/package'
      } else {
        this.$router.push('/session/signin')
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
  .download-button.ant-btn-primary {
    background: linear-gradient(to right, @theme4, @theme6);
    border: none;
    transition: all 0.4s @hoverEasing;
    background-size: 384px 100%;
    &:hover {
      background-position: -180px;
      transition: all 0.4s @hoverEasing;
    }
    &:active {
      transform: scale(0.95, 0.95);
      box-shadow: @ele1;
    }
  }
</style>
