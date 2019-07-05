<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    h1(class="text-ele" style="margin-bottom: 16px; line-height: 1.0;" v-text="level.metadata.title")
    div(class="text-ele" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin-bottom: 20px;" v-text="level.metadata.artist.name")
    div(style="margin-bottom: 48px;")
      difficulty-badge(v-for="chart in level.charts" :key="chart.id" :value="chart" class="ele3" style="margin-right: 8px;")
    div(style="margin-bottom: 32px;")
      a-button.download-button.ele3(
        type="primary"
        size="large"
        @click="download"
      )
        font-awesome-icon(icon="download" fixed-width style="margin-right: .5rem;")
        span Download #[template(v-if="level.packageSize") ({{formatSize(level.packageSize)}})]
      nuxt-link(
        :to="{ name: 'levels-id-manage', params: { id: level.uid }}"
        v-if="$store.state.user && (level.owner.id === $store.state.user.id)"
      )
        a-button.ele3(
          type="default"
          size="large"
          :style="{ 'margin-left': '1rem' }"
        )
          font-awesome-icon(icon="briefcase" fixed-width style="margin-right: .5rem;")
          span Manage
    a-row(:gutter="16")
      a-col(:xs="24" :lg="8")
        a-card(class="ele3" style="margin-bottom: 16px;")
          player-avatar(style="margin-bottom: 16px;" :player="level.owner")
          div(style="overflow: auto;" v-if="levelDescription" v-html="levelDescription")
          p(class="card-heading") Rating
          div(style="margin-bottom: 16px;")
            a-rate(
              :default-value="(ratings.rating || ratings.average) * 0.5"
              allow-half
              :disabled="ratings.rating === undefined"
              @change="rate"
            )
            span.card-secondary-text {{ (Math.floor(ratings.average * 0.5 * 100) / 100).toFixed(2) }} ({{ ratings.total }})
          template(v-if="level.tags.length > 0")
            .card-heading Tags
            div(style="margin-bottom: 16px;")
              a-tag(v-for="tag in level.tags" :key="tag") {{ tag }}
          .card-heading Last updated
          .card-secondary-text(style="margin-bottom: 0px;") {{ readableDate(level.modificationDate) }}
        a-card(class="ele3" style="margin-bottom: 16px;")
          p(class="card-heading") Music
          p(class="card-em-text" style="margin-bottom: 4px;") SOTUI vs. Missionary
          a-button(class="card-button" style="width: fit-content; margin-top: -2px; margin-bottom: 20px; padding-left: 12px; padding-right: 14px;")
            font-awesome-icon(icon="link" fixed-width style="margin-right: 4px;")
            span Source
          p(class="card-heading") Cover art
          p(class="card-em-text" style="margin-bottom: 4px;") ゆなこ
          a-button(class="card-button" style="width: fit-content; margin-top: -2px; margin-bottom: 20px; padding-left: 12px; padding-right: 14px;")
            font-awesome-icon(icon="link" fixed-width style="margin-right: 4px;")
            span Source
          p(class="card-heading") Chart
          p(class="card-em-text" style="margin-bottom: 16px;") PTB10
          p(class="card-heading") Storyboard
          p(class="card-em-text" style="margin-bottom: 0px;") Fizzest
      a-col(:xs="24" :lg="16")
        a-card(class="ele3 rankings-card" style="margin-bottom: 16px;")
          a-radio-group(v-model="rankingsChart")
            a-radio-button(v-for="chart in level.charts" :value="chart.type" :key="chart.id") {{ chart.name }}
          a-table.rankings-table(
            :columns="columns"
            :row-key="record => record.id"
            :data-source="rankings"
            :pagination="rankings_pagination"
            :loading="rankings_loading"
            :scroll="{ x: true }"
            :rowClassName="(record, index) => rowClass(record, index)"
            @change="loadRankings"
          )
            template(v-slot:rank="ranking") {{ '#' + ranking }}
            template(slot="owner" slot-scope="text, record")
              .ranking-player-avatar
                nuxt-link(:to="'/profile/' + (record.owner.name || record.owner.uid)" style="display: flex; align-items: center;")
                  a-avatar(:size="20 + Math.max(0, 4 - record.rank) * 4" :src="record.owner.avatarURL")
                  span.ranking-player-avatar-name(v-text="record.owner.name || record.owner.uid")
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
        div(style="margin: 12px;")
          disqus(shortname="cytoid" :identifier="'browse/' + level.uid" :url="'https://cytoid.io/levels/' + level.uid")
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import Disqus from 'vue-disqus/src/vue-disqus.vue'
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
    width: 0,
    scopedSlots: {
      customRender: 'mods'
    }
  },
  {
    title: 'Achieved',
    dataIndex: 'date',
    width: 0,
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
  components: {
    ScoreBadge,
    PlayerAvatar,
    DifficultyBadge,
    Disqus,
  },
  data: () => ({
    level: null,
    ratings: null,
    rankings: [],
    rankings_pagination: {
      current: 1,
      total: 0,
      pageSize: 10,
    },
    rankings_loading: true,
    rankingsChart: null,
    columns,
    modNames
  }),
  computed: {
    levelDescription() {
      return this.level.description !== null ? marked(this.level.description) : null
    },
  },
  watch: {
    rankingsChart() {
      this.loadRankings(this.rankings_pagination)
    }
  },
  asyncData({ $axios, params, store }) {
    return Promise.all([
      $axios.get('/levels/' + params.id),
      $axios.get(`/levels/${params.id}/ratings`),
    ])
      .then(([levelResponse, ratingResponse]) => {
        store.commit('setBackground', { source: levelResponse.data.bundle.background })
        return {
          level: levelResponse.data,
          ratings: ratingResponse.data,
          rankingsChart: levelResponse.data.charts[0].type
        }
      })
  },
  mounted() {
    this.loadRankings(this.rankings_pagination)
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
    loadRankings(pagination) {
      this.rankings_loading = true
      // TODO: adjust difficulty
      this.$axios.get(`/levels/${this.level.uid}/charts/${this.rankingsChart}/ranking`, {
        params: {
          limit: pagination.pageSize,
          page: pagination.current - 1,
        },
      }).then((res) => {
        this.rankings_pagination.total = parseInt(res.headers['x-total-entries'])
        this.rankings_pagination.current = parseInt(res.headers['x-current-page']) + 1
        this.rankings_loading = false
        this.rankings = res.data
      })
    },
    rowClass(record) {
      let classes = 'row-score'
      if (record.score === 1000000) {
        classes += ' row-score-max'
      } else if (record.score >= 999500) {
        classes += ' row-score-sss'
      }
      if (record.rank === 1) {
        classes += ' row-score-1st'
      } else if (record.rank === 2) {
        classes += ' row-score-2nd'
      } else if (record.rank === 3) {
        classes += ' row-score-3rd'
      }
      return classes
    },
    formatSize(size) {
      return formatBytes(size)
    },
    download() {
      if (this.$store.state.user) {
        window.location.href = process.env.apiURL + '/levels/' + this.level.uid + '/package'
      } else {
        this.$router.push('/session/login')
      }
    }
  },
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

<style lang="less">
    .ant-table td, .ant-table th {
        white-space: nowrap;
    }
    .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
        padding: 6px 8px;
    }
    .row-score-sss {
        color: white !important;
        background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 100%);
        a {
            color: white !important;
        }
    }
    .row-score-max {
        color: white;
        background-image: linear-gradient(19deg, #21D4FD 0%, #B721FF 100%);
        a {
            color: white !important;
        }
    }
    // Tell Safari to fix their shit
    // See https://bug.webkit.org/show_bug.cgi?id=9268
    @media not all and (min-resolution: .001dpcm) {
        @supports  (-webkit-appearance: none) {
            .row-score-sss {
                color: white;
                background-image: linear-gradient(315deg, #FD7C5C 0%, #FD7C5C 100%);
            }
            .row-score-max {
                color: white;
                background-image: linear-gradient(19deg, #6C7BFE 0%, #6C7BFE 100%);
            }
        }
    }
    .row-score-1st {
        font-size: 20px !important;
        .ranking-player-avatar-name {
            font-size: 20px !important;
        }
    }
    .row-score-2nd {
        font-size: 18px !important;
        .ranking-player-avatar-name {
            font-size: 18px !important;
        }
    }
    .row-score-3rd {
        font-size: 16px !important;
        .ranking-player-avatar-name {
            font-size: 16px !important;
        }
    }
    .rankings-table {
        .ant-badge {
            margin-right: 2px;
        }
        table {
            padding: 0px 24px;
            border-collapse: separate;
            border-spacing: 0 4px;
        }
        td:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }
        td:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
    }
    .rankings-card .ant-card-body {
        padding: 24px 0;
        .ant-pagination {
            padding: 0 24px;
        }
    }
</style>
