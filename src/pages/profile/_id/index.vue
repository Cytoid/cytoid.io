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
        h1.username(class="text-ele" v-text="profile.user.name || profile.user.uid" style="font-size: 32px;")
        p.status.text-ele
          font-awesome-icon.status-icon(:icon="['fas', 'circle']" :class="{ online: profile.user.online }")
          | {{ profile.user.online ? 'Online' : 'Offline' }}
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
            v-for="rank in recentRanks"
            :key="rank.id"
            :rank="rank"
          )
      a-col(:xs="{ span: 24 }" :lg="{ span: 16 }" :xl="{ span: 17 }")
        a-card.statistics-card(class="ele3" style="margin-bottom: 16px;")
          a-row
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total ranked plays
              p.card-em-text(v-text="profile.activity.totalRankedPlays")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total cleared notes
              p.card-em-text(v-text="commaSeparated(profile.activity.clearedNotes)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Highest max combo
              p.card-em-text(v-text="commaSeparated(profile.activity.maxCombo)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Average ranked accuracy
              p.card-em-text(v-text="(profile.activity.averageRankedAccuracy * 100).toFixed(2) + '%'")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total ranked score
              p.card-em-text(v-text="commaSeparated(profile.activity.totalRankedScore)")
            a-col(:xs="{ span: 24 }" :sm="{ span: 12 }" :md="{ span: 8 }")
              p.card-heading Total play time
              p.card-em-text(v-text="profile.activity.totalPlayTime")
          a-radio-group(size="small" v-model="chartMode" style="margin-bottom: 16px;")
            a-radio-button(value="activity") Ranked plays
            a-radio-button(value="rating") Rating
            a-radio-button(value="accuracy") Average Accuracy
          line-chart(v-if="profile.timeseries" :data="profile.timeseries" :mode="chartMode")
        a-card(
          v-if="(profile.user.featuredLevels.length > 0) || (profile.user.levels.length > 0)"
          class="levels-card"
        )
          p.heading(style="position: absolute; margin-left: 24px; margin-top: 24px; z-index: 1;") Uploaded levels
          div(v-if="profile.user.featuredLevels.length > 0" :class="{ 'levels-card-has-featured ele3': profile.user.featuredLevels.length > 0 }")
            div(style="position: absolute; bottom: 0px; background: linear-gradient(to bottom, transparent, hsla(226, 15%, 19%, 15%)); width: 100%; height: 48px;")
            .level-card-container.small.featured-levels-container(style="padding: 56px 16px 0 16px;")
              level-card(v-for="level in profile.user.featuredLevels" :key="level.id" :value="level")
            div(style="padding: 16px;")
              nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id, featured: true } }")
                a-button(class="card-button" style="width: 100%;")
                  font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                  span View all {{profile.user.featuredLevelsCount}} featured
          .level-card-container.small.regular-levels-container(v-if="profile.user.levels.length > 0" :style="profile.user.featuredLevels.length > 0 ? 'padding: 16px 16px 0 16px;' : 'padding: 56px 16px 0 16px;'")
            level-card(v-for="level in profile.user.levels" :key="level.id" :value="level")
          div(style="padding: 16px;")
            nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id } }")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                span View all {{profile.user.levelsCount}}
        div(style="margin: 12px;")
          disqus(shortname="cytoid" :identifier="'profile/' + profile.user.uid" :url="'https://cytoid.io/profile/' + profile.user.uid")
</template>

<script>
import marked from 'marked'
import Disqus from 'vue-disqus/src/vue-disqus.vue'
import gql from 'graphql-tag'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import LevelCard from '@/components/level/LevelCard'
import LineChart from '@/components/profile/LineChart'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PlayerInfoAvatar from '@/components/player/PlayerInfoAvatar'
import { handleErrorBlock } from '@/plugins/antd'
import { Meta } from '@/utils'

const query = gql`
fragment LevelInfo on UserLevel{
  id
  uid
  title
  metadata {
    title_localized
    artist {
      name
    }
  }
  bundle {
    background: backgroundImage
    music
    music_preview: musicPreview
  }
  charts {
    type
    difficulty
    name
    notesCount
  }
}
query FetchProfilePage($uid: String!) {
  profile(uid: $uid) {
    bio
    headerPath
    user {
      id
      uid
      name
      registrationDate
      avatarURL
      collections(first: 2) {
        id
        uid
        title
        creationDate
      }
      online
      levelsCount(category: "!featured")
      featuredLevelsCount: levelsCount(category: "featured")
      levels(category: "!featured", first: 6) { ...LevelInfo }
      featuredLevels: levels(category: "featured", first: 6) { ...LevelInfo }
    }
    rating
    exp {
      totalExp
      currentLevelExp
      nextLevelExp
      currentLevel
    }
    activity {
      totalRankedPlays
      totalRankedScore
      clearedNotes
      maxCombo
      averageRankedAccuracy
      totalPlayTime
    }
    timeseries {
      count
      accumulativeAccuracy
      accumulativeRating
      week
      year
    }
  }
}
`
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
    recentRanks: [],
    profile: null,
    chartMode: 'activity'
  }),
  head() {
    const name = this.profile.user.name || this.profile.user.uid
    const meta = new Meta(name, this.profile.bio || '')
    meta.extend('author', name)
    if (this.profile.headerURL) {
      meta.extend('og:image', this.profile.headerURL)
    }
    return meta
  },
  computed: {
    bio() {
      return marked(this.profile.bio || 'There is no bio yet.')
    },
  },
  async asyncData({ app, $axios, params, error, store }) {
    const profile = await app.apolloProvider.defaultClient.query({
      query,
      variables: { uid: params.id }
    }).then(({ data }) => data && data.profile)
      .catch(err => handleErrorBlock(err, error))
    console.log(profile)
    store.commit('setBackground', { source: profile.headerPath })
    const recentRanks = await $axios.get(`/profile/${profile.user.id}/ranks`)
      .then(res => res.data)
      .catch(err => handleErrorBlock(err, error))
    return {
      recentRanks,
      profile,
    }
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
