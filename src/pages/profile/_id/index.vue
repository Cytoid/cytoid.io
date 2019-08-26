<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    .header-container
      .avatar-container
        player-info-avatar(
          :exp="profile.exp"
          :avatar="profile.user.avatarURL"
          :rating="profile.rating || 0"
        )
      .player-info-container
        h1.username(class="text-ele" v-text="profile.user.uid" style="font-size: 32px;")
        p.status.text-ele
          font-awesome-icon.status-icon(:icon="['fas', 'circle']" :class="{ online: profile.online }")
          | {{ profile.online ? 'Online' : 'Offline' }}
        p.details.text-ele
          span
            font-awesome-icon(:icon="['fas', 'calendar']")
            | Joined {{ $dateFromNow(profile.user.registrationDate) }}
    a-row(:gutter="16")
      a-col(:xs="{ span: 24 }" :lg="{ span: 8 }" :xl="{ span: 7 }")
        a-card.bio(style="background: none; margin-bottom: 16px;")
          p.heading Bio
          div(class="text-ele" style="margin-bottom: -1rem;" v-html="bio")
        a-card(style="background: none; margin-bottom: 16px;")
          p.heading Recent ranks
          player-recent-rank(
            v-for="rank in profile.recents.ranks"
            :key="rank.id"
            :rank="rank"
          )
      a-col(:xs="{ span: 24 }" :lg="{ span: 16 }" :xl="{ span: 17 }")
        a-card.statistics-card(class="ele3" style="margin-bottom: 16px;")
          a-row
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total ranked plays
              p.card-em-text(v-text="profile.activities.total_ranked_plays")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total cleared notes
              p.card-em-text(v-text="commaSeparated(profile.activities.cleared_notes)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Highest max combo
              p.card-em-text(v-text="commaSeparated(profile.activities.max_combo)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Average ranked accuracy
              p.card-em-text(v-text="(profile.activities.average_ranked_accuracy * 100).toFixed(2) + '%'")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total ranked score
              p.card-em-text(v-text="commaSeparated(profile.activities.total_ranked_score)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total play time
              p.card-em-text(v-text="profile.activities.total_play_time")
          a-radio-group(size="small" v-model="chartMode" style="margin-bottom: 16px;")
            a-radio-button(value="activity") Ranked plays
            a-radio-button(value="rating") Rating
            a-radio-button(value="accuracy") Average Accuracy
          line-chart(:data="profile.timeseries" :mode="chartMode")
        a-card(
          v-if="featuredLevels.length > 0 || levels.length > 0"
          class="levels-card"
        )
          p.heading(style="position: absolute; margin-left: 24px; margin-top: 24px; z-index: 1;") Uploaded levels
          div(v-if="featuredLevels.length > 0" :class="{ 'levels-card-has-featured ele3': featuredLevels.length > 0 }")
            div(style="position: absolute; bottom: 0px; background: linear-gradient(to bottom, transparent, hsla(226, 15%, 19%, 15%)); width: 100%; height: 48px;")
            .level-card-container.small.featured-levels-container(style="padding: 56px 16px 0 16px;")
              level-card(v-for="level in featuredLevels" :key="level.id" :value="level")
            div(style="padding: 16px;")
              nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id, featured: true } }")
                a-button(class="card-button" style="width: 100%;")
                  font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                  span View all {{profile.levels.featuredLevelsCount}} featured
          .level-card-container.small.regular-levels-container(v-if="levels.length > 0" :style="featuredLevels.length > 0 ? 'padding: 16px 16px 0 16px;' : 'padding: 56px 16px 0 16px;'")
            level-card(v-for="level in levels" :key="level.id" :value="level")
          div(style="padding: 16px;")
            nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id } }")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                span View all {{profile.levels.totalLevelsCount}}
        div(style="margin: 12px;")
          disqus(shortname="cytoid" :identifier="'profile/' + profile.user.uid" :url="'https://cytoid.io/profile/' + profile.user.uid")
</template>

<script>
import marked from 'marked'
import Disqus from 'vue-disqus/src/vue-disqus.vue'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import LevelCard from '@/components/level/LevelCard'
import LineChart from '@/components/profile/LineChart'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayerInfoAvatar from '@/components/player/PlayerInfoAvatar'
import { handleErrorBlock } from '@/plugins/antd'
import { Meta } from '@/utils'

export default {
  components: {
    PlayerRecentRank,
    LineChart,
    DifficultyBadge,
    ScoreBadge,
    PlayerInfoAvatar,
    LevelCard,
    Disqus,
  },
  layout: 'background',
  data: () => ({
    levels: [],
    featuredLevels: [],
    profile: null,
    chartMode: 'activity'
  }),
  head() {
    const name = this.profile.user.uid
    const meta = new Meta(name, this.profile.profile.bio)
    meta.extend('author', name)
    if (this.profile.profile.headerURL) {
      meta.extend('og:image', this.profile.profile.headerURL)
    }
    return meta
  },
  computed: {
    bio() {
      return marked(this.profile.profile.bio || 'There is no bio yet.')
    },
  },
  asyncData({ $axios, params, error, store }) {
    return $axios.get(`/profile/${params.id}/full`)
      .then((res) => {
        const data = res.data
        store.commit('setBackground', { source: data.profile.headerURL })

        return data
      })
      .then(profile => Promise.all([
        Promise.resolve(profile),
        $axios.get('/levels', {
          params: {
            owner: profile.user.uid,
            featured: true,
            limit: 6,
            sort: 'creation_date',
            order: 'desc',
          }
        }).then(res => res.data),
        $axios.get('/levels', {
          params: {
            owner: profile.user.uid,
            limit: 6,
            featured: false,
            sort: 'creation_date',
            order: 'desc',
          }
        }).then(res => res.data),
      ]))
      .then(([profile, featuredLevels, levels]) => ({ profile, featuredLevels, levels }))
      .catch(err => handleErrorBlock(err, error))
  },
  methods: {
    commaSeparated(number) {
      if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return '0'
    },
  },
}
</script>

<style lang="less" scoped>
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

  .header-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 24px;
    @gutter-y: 32px;
    @gutter-x: 24px;
    .avatar-container {
      flex-shrink: 0;
      flex-grow: 1;
      padding: @gutter-y @gutter-x;
      // text-align: center;
    }
    .player-info-container {
      padding: @gutter-y @gutter-x;
      flex-grow: 9999;
      display: inline-block;
      vertical-align: middle;
      .status {
        font-size: 14px;
        .status-icon {
          margin-right: 0.5rem;
          &.online {
            color: hsla(120, 68%, 57%, 1);
          }
          color: #757575;
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
  }

  .ant-tabs .ant-tabs-small-bar .ant-tabs-tab {
    padding: 8px 0 !important;
  }
</style>

<style lang="less">
  .bio img {
    max-width: 100%;
  }
  .levels-card-has-featured {
    position: relative;
    background-image: linear-gradient(to right bottom, #b91d73, #f953c6);
    border-radius: 4px;
  }
  .levels-card {
    .ant-card-body {
      padding: 0;
    }
  }
</style>
