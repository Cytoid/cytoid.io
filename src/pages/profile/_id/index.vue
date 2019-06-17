<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    a-row(style="margin-bottom: 48px;")
      a-col(:span="24")
        div(style="padding-left: 32px;")
          player-info-avatar(
            :exp="profile.exp"
            :avatar="profile.user.avatarURL"
            :rating="profile.rating || 0"
          )
          .player-info-container
            h1.username(class="text-ele" v-text="profile.user.name || profile.user.uid" style="font-size: 32px;")
            p.status(class="text-ele")
              font-awesome-icon.status-icon(:icon="['fas', 'circle']" style="color: hsla(120, 68%, 57%, 1);")
              | Online
            p.details(class="text-ele")
              span
                font-awesome-icon(:icon="['far', 'map-marker-alt']")
                | Hong Kong
              span
                font-awesome-icon(:icon="['far', 'calendar']")
                | Joined {{readableDate(profile.user.registrationDate).fromNow()}}
    a-row(:gutter="16")
      a-col(:xs="{ span: 24 }" :lg="{ span: 8 }" :xl="{ span: 7 }")
        a-card.bio(style="background: none; margin-bottom: 16px;")
          p.heading Bio
          div(class="text-ele" style="margin-bottom: -1rem;" v-html="bio")
        a-card(style="background: none; margin-bottom: 16px;")
          p.heading Recent ranks
          div(
            v-for="rank in profile.recents.ranks"
            :key="rank.uid"
            class="recent-rank ele3"
            :class="Number(rank.rank) === 1 ? 'gold' : (Number(rank.rank) === 2 ? 'silver' : (Number(rank.rank) === 3 ? 'bronze' : ''))"
            style="position: relative; margin-top: 8px;"
          )
            .recent-rank-background(
              v-if="rank.backgroundURL"
              :style="{ 'background-image': 'url(' + rank.backgroundURL + ')', 'background-size': 'cover' }"
            )
            .recent-rank-overlay
            div(style="display: flex; margin-bottom: 8px; position: relative; z-index: 2;")
              span(
                :style="{ 'font-weight': Number(rank.rank) <= 3 ? 'bold' : 'normal' }"
              ) {{ '#' + rank.rank }}
              nuxt-link(:to="{ name: 'levels-id', params: { id: rank.uid }}" style="margin-left: 4px;" v-text="rank.title")
            div(style="display: flex; position: relative; z-index: 2;")
              div(style="display: flex; font-size: 12px;")
                difficulty-badge(:value="{ type: rank.type, name: rank.name, difficulty: rank.difficulty }" :small="true")
                score-badge(:value="rank.score" style="margin-left: 4px;")
              div(style="display: flex; margin-left: auto;")
                span.card-secondary-text(style="font-size: 12px; padding-top: 1px;" v-text="readableDate(rank.date).fromNow()")
      a-col(:xs="{ span: 24 }" :lg="{ span: 16 }" :xl="{ span: 17 }")
        a-card.statistics-card(class="ele3" style="margin-bottom: 16px;")
          a-row
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Ranked plays
              p.statistics-slot(v-text="profile.activities.total_ranked_plays")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Cleared notes
              p.statistics-slot(v-text="commaSeparated(profile.activities.cleared_notes)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Max combo
              p.statistics-slot(v-text="commaSeparated(profile.activities.max_combo)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Average ranked accuracy
              p.statistics-slot(v-text="Math.round(profile.activities.average_ranked_accuracy*100) + '%'")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total ranked score
              p.statistics-slot(v-text="commaSeparated(profile.activities.total_ranked_score)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total play time
              p.statistics-slot(v-text="profile.activities.total_play_time")
          a-radio-group(defaultValue="global_ranking" size="small" @change="handleChartChange" style="margin-bottom: 16px;")
            a-radio-button(value="global_ranking") Global ranking
            a-radio-button(value="region_ranking") Region ranking
            a-radio-button(value="rating") Rating
            a-radio-button(value="accuracy") Average Accuracy
          line-chart(v-if="true" :styles="chartStyles" :chart-data="chartData" :options="chartOptions")
          // Disable the line chart just for now.
        a-card(
          v-if="featuredLevels.length > 0 || levels.length > 0"
          class="levels-card"
        )
          p.heading(style="position: absolute; margin-left: 24px; margin-top: 24px; z-index: 1;") Uploaded levels
          div(v-if="featuredLevels.length > 0" :class="{ 'levels-card-has-featured': featuredLevels.length > 0 }")
            div(style="position: absolute; bottom: 0px; background: linear-gradient(to bottom, transparent, hsla(226, 15%, 19%, 15%)); width: 100%; height: 48px;")
            .level-card-container.small.featured-levels-container(style="padding: 56px 16px 0 16px;")
              level-card(v-for="level in featuredLevels" :key="level.id" :value="level")
            div(style="padding: 16px;")
              nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id } }")
                a-button(class="card-button" style="width: 100%;")
                  font-awesome-icon(icon="angle-double-right" fixed-width)
                  span View all {{profile.levels.featuredLevelsCount}} featured
          .level-card-container.small.regular-levels-container(v-if="levels.length > 0" :style="featuredLevels.length > 0 ? 'padding: 16px 16px 0 16px;' : 'padding: 56px 16px 0 16px;'")
            level-card(v-for="level in levels" :key="level.id" :value="level")
          div(style="padding: 16px;")
            nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id } }")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="angle-double-right" fixed-width)
                span View all {{profile.levels.totalLevelsCount}}
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import LevelCard from '@/components/level/LevelCard'
import LineChart from '@/components/profile/LineChart'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayerInfoAvatar from '@/components/player/PlayerInfoAvatar'
export default {
  components: { LineChart, DifficultyBadge, ScoreBadge, PlayerInfoAvatar, LevelCard },
  data: () => ({
    levels: [],
    featuredLevels: [],
    profile: null,
    chartData: null,
    chartOptions: null,
  }),
  computed: {
    bio() {
      return marked(this.profile.profile.bio || 'There is no bio yet.')
    },
    chartStyles() {
      return {
        position: 'relative',
        height: '192px',
      }
    }
  },
  asyncData({ $axios, params, error }) {
    return $axios.get('/profile/' + params.id)
      .then(res => res.data)
      .then(profile => Promise.all([
        Promise.resolve(profile),
        $axios.get('/levels', { params: {
          owner: profile.user.id,
          featured: true,
          limit: 6,
          sort: 'creation_date',
          order: 'desc',
        } }).then(res => res.data),
        $axios.get('/levels', { params: {
          owner: profile.user.id,
          limit: 6,
          featured: false,
          sort: 'creation_date',
          order: 'desc',
        } }).then(res => res.data),
      ]))
      .then(([profile, featuredLevels, levels]) => ({ profile, featuredLevels, levels }))
      .catch((err) => {
        if (err.response?.status === 404) {
          error({ statusCode: 404, message: 'Profile not found' })
        } else {
          throw err
        }
      })
  },
  mounted() {
    this.updateChart('global_ranking')
    console.log(this.profile)
  },
  methods: {
    commaSeparated(number) {
      if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return '0'
    },
    readableDate(date) {
      return moment(date)
    },
    updateChart(type) {
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.3)',
              fontSize: 12,
              fontFamily: 'Nunito',
              beginAtZero: false,
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: 'rgba(255, 255, 255, 0.3)',
              fontSize: 12,
              fontFamily: 'Nunito',
              stepSize: 1,
            }
          }]
        },
        elements: {
          line: {
            tension: 0
          }
        }
      }
      switch (type) {
        case 'global_ranking':
          this.chartData = {
            labels: ['05/12', '05/13', '05/13', '05/14', '05/15', '05/16', '05/17'],
            datasets: [
              {
                label: 'Global ranking',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontColor: 'white',
                data: [13, 12, 12, 12, 12, 11, 11],
                fill: 'start',
              }
            ],
          }
          options.scales.yAxes[0].ticks.reverse = true
          options.scales.yAxes[0].ticks.stepSize = 1
          break
        case 'region_ranking':
          this.chartData = {
            labels: ['05/12', '05/13', '05/13', '05/14', '05/15', '05/16', '05/17'],
            datasets: [
              {
                label: 'Region ranking',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontColor: 'white',
                data: [2, 2, 1, 1, 1, 1, 1],
                fill: 'start',
              }
            ],
          }
          options.scales.yAxes[0].ticks.reverse = true
          options.scales.yAxes[0].ticks.stepSize = 1
          break
        case 'rating':
          this.chartData = {
            labels: ['05/12', '05/13', '05/13', '05/14', '05/15', '05/16', '05/17'],
            datasets: [
              {
                label: 'Rating',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontColor: 'white',
                data: [0, 14.13, 14.57, 14.82, 15.11, 15.03, 15.08, 15.15]
              }
            ],
          }
          options.scales.yAxes[0].ticks.reverse = false
          options.scales.yAxes[0].ticks.stepSize = undefined
          break
        case 'accuracy':
          this.chartData = {
            labels: ['05/12', '05/13', '05/13', '05/14', '05/15', '05/16', '05/17'],
            datasets: [
              {
                label: 'Average accuracy',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                fontColor: 'white',
                data: [97.20, 97.24, 97.33, 97.01, 97.44, 97.50, 97.69]
              }
            ],
          }
          options.scales.yAxes[0].ticks.reverse = false
          options.scales.yAxes[0].ticks.stepSize = undefined
          break
      }
      this.chartOptions = options
    },
    handleChartChange(e) {
      this.updateChart(e.target.value)
    }
  },
}
</script>

<style lang="less" scoped>
  .statistics-slot {
    margin-top: -4px;
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 300;
  }
  .recent-rank {
    position: relative;
    border-radius: 4px;
    border-left: 4px solid @theme5;
    margin: 8px -8px;
    padding: 12px 24px 16px;
    transition: 0.4s @hoverEasing;
    overflow: hidden;
    &:hover {
      border-left: 4px solid @theme6;
    }
    &:hover .recent-rank-background {
      transform: scale(1.2, 1.2);
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
    transition: 0.4s @hoverEasing;
  }
  .recent-rank-overlay {
    .recent-rank-background;
    background-color: rgba(0, 0, 0, 0.8);
  }
  .statistics-card {
    background: linear-gradient(to right bottom, @theme4, @theme5);
    .ant-radio-button-wrapper {
      font-size: 12px;
      font-weight: normal;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.3);
      border: none;
    }
    .ant-radio-button-wrapper-checked {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 1);
      border: white;
      box-shadow: none;
      font-weight: bold;
      &:hover {
        box-shadow: none;
      }
    }
    .ant-radio-button-wrapper:not(:first-child)::before {
      background-color: unset;
    }
  }
  .player-info-container {
    margin-top: 48px;
    margin-left: 0;
    display: inline-block;
    vertical-align: middle;
    .status {
      font-size: 14px;
      .status-icon {
        margin-right: 0.5rem;
      }
      margin-bottom: 2rem;
    }
    .username {
      margin-bottom: 4px;
    }
    .details {
      font-size: 12px;
      span {
        margin-right: 3rem;
        svg {
          margin-right: 0.5rem;
        }
      }
    }
  }
  .ant-tabs .ant-tabs-small-bar .ant-tabs-tab {
    padding: 8px 0 !important;
  }
  @media(min-width: 523px) {
    .player-info-container {
      margin-top: 0;
      margin-left: 32px;
    }
  }
</style>

<style lang="less">
  .bio img {
    max-width: 100%;
  }
  .levels-card-has-featured {
    position: relative;
    background-image: linear-gradient(to right, #ff758c 0%, #ff7eb3 100%);
    border-radius: 4px;
  }
  .levels-card {
    .ant-card-body {
      padding: 0;
    }
  }
  .card-button {
    border: none;
    font-size: 12px;
    font-weight: bold;
    color: white;
    margin-bottom: 4px;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.1);
    transition: 0.4s @hoverEasing;
    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
      color: white !important;
      transform: scale(1.01, 1.01);
    }
    &:active, &:focus {
      background: rgba(255, 255, 255, 0.3) !important;
      color: white !important;
      transform: scale(0.98, 0.98);
    }
  }
</style>
