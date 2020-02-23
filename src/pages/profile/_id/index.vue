<i18n locale="en" src="@/locale/en/profile.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/profile.json" />
<i18n locale="zh-tw" src="@/locale/zh-TW/profile.json" />

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
          | {{ $t(profile.user.online ? 'online' : 'offline') }}
        p.details.text-ele
          span
            font-awesome-icon(:icon="['fas', 'calendar']")
            span(v-t="{ path: 'join_date', args: { date: $dateFromNow(profile.user.registrationDate) } }")
    .columns
      .column.is-one-quarter-widescreen.is-two-fifths
        .bio
          p.heading(v-t="'bio_title'")
          .text-ele(v-html="bio")
        div
          p.heading(v-t="'recent_ranks_title'")
          player-recent-rank(
            v-for="rank in recentRanks"
            :key="rank.id"
            :rank="rank"
          )
      .column.is-three-quarters-widescreen.is-three-fifths
        .box.statistics-card
          .columns.is-multiline
            .column.is-one-third
              p.card-heading(v-t="'total_ranked_plays'")
              p.card-em-text(v-text="profile.activity.totalRankedPlays")
            .column.is-one-third
              p.card-heading(v-t="'total_cleared_notes'")
              p.card-em-text(v-text="commaSeparated(profile.activity.clearedNotes)")
            .column.is-one-third
              p.card-heading(v-t="'highest_max_combo'")
              p.card-em-text(v-text="commaSeparated(profile.activity.maxCombo)")
            .column.is-one-third
              p.card-heading(v-t="'avg_ranked_accuracy'")
              p.card-em-text(v-text="(profile.activity.averageRankedAccuracy * 100).toFixed(2) + '%'")
            .column.is-one-third
              p.card-heading(v-t="'total_ranked_score'")
              p.card-em-text(v-text="commaSeparated(profile.activity.totalRankedScore)")
            .column.is-one-third
              p.card-heading(v-t="'total_play_time'")
              p.card-em-text(v-text="profile.activity.totalPlayTime")
          a-radio-group(v-if="profile.timeseries" size="small" v-model="chartMode" style="margin-bottom: 16px;")
            a-radio-button(value="activity" v-t="'chart_radio_ranked_plays'")
            a-radio-button(value="rating" v-t="'chart_radio_rating'")
            a-radio-button(value="accuracy" v-t="'chart_radio_avg_accuracy'")
          line-chart(v-if="profile.timeseries" :data="profile.timeseries" :mode="chartMode")
        .box.levels-box(v-if="(profile.user.featuredLevels.length > 0) || (profile.user.levels.length > 0)")
          .levels-box-container.has-featured(v-if="profile.user.featuredLevels.length > 0")
            p.heading(v-t="'levels_title'")
            .level-card-container.small
              level-card(v-for="level in profile.user.featuredLevels" :key="level.id" :value="level")
            nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id, featured: true } }")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                span(v-t="{ path: 'levels_featured_all_btn', args: { count: profile.user.featuredLevelsCount }}")
          .levels-box-container(v-if="profile.user.levels.length > 0")
            .level-card-container.small
              level-card(v-for="level in profile.user.levels" :key="level.id" :value="level")
            nuxt-link(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id } }")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                span(v-t="{ path: 'levels_all_btn', args: { count: profile.user.levelsCount }}")

        .box(v-if="profile && profile.user && profile.user.collections && profile.user.collections.length > 0")
          p.heading(style="margin-bottom: 16px;" v-t="'collections_title'")
          .level-card-container.small.regular-levels-container
            collection-simple-card(v-for="collection in profile.user.collections" :key="collection.id" :value="collection")
          a(
            style="margin-top: 16px; display: block;"
          )
            a-button(class="card-button" style="width: 100%;")
              font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
              span(v-t="{ path: 'collections_all_btn', args: { count: profile.user.collectionsCount }}")
        div(style="margin: 12px;")
          disqus(shortname="cytoid" :identifier="'profile/' + profile.user.uid" :url="'https://cytoid.io/profile/' + profile.user.uid")
</template>

<script>
import marked from 'marked'
import Disqus from 'vue-disqus/src/vue-disqus.vue'
import gql from 'graphql-tag'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import LevelCard from '@/components/level/LevelCard'
import CollectionSimpleCard from '@/components/collection/CollectionSimpleCard'
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
      collections(first: 3) {
        id
        uid
        coverPath
        title
        slogan
        levelCount
        creationDate
      }
      collectionsCount
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
    CollectionSimpleCard,
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
    if (!profile || !profile.user) {
      return error({ statusCode: 404, message: 'Profile not found' })
    }
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

<style lang="scss">
  .bio {
    img {
      max-width: 100%;
    }
  }
  .levels-box-container {
    border-radius: $box-radius;
    padding: $box-padding;
    &.has-featured {
      position: relative;
      background-image: linear-gradient(to right bottom, #b91d73, #f953c6);
    }
    .level-card-container {
      margin-bottom: 1rem;
      margin-top: 0.5rem;
    }
    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 48px;
      background: linear-gradient(transparent, rgba(41, 45, 56, 0.15));
    }
  }
  .box.levels-box {
    padding: 0 !important;
  }
</style>
