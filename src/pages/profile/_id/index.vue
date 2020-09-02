<template lang="pug">
  .section: .container(style="margin-top: 256px;")
    .header-container
      .avatar-container
        player-info-avatar(
          :exp="profile.exp"
          :avatar="profile.user.avatar.large"
          :rating="profile.rating || 0"
        )
      .player-info-container
        h1.username(class="text-ele" v-text="profile.user.name || profile.user.uid" style="font-size: 32px;")
        p.status.text-ele
          font-awesome-icon.status-icon(:icon="['fas', 'circle']" :class="{ online }")
          span(v-if="profile.user.lastSeen" v-t="{ path: 'last_seen_date', args: { date: $dateFromNow(profile.user.lastSeen) }}")
          span(v-else v-t="'offline'")
        p.details.text-ele
          span
            font-awesome-icon(:icon="['fas', 'calendar']")
            span(v-t="{ path: 'join_date', args: { date: $dateFromNow(profile.user.registrationDate) } }")
    .columns
      .column.is-one-quarter-widescreen.is-two-fifths
        .bio(style="margin-top: 1rem;")
          p.heading(v-t="'bio_title'")
          .content(v-html="bio")
        div(style="margin-top: 1rem;" v-if="profile.badges && profile.badges.length > 0")
          p.heading(style="margin-bottom: 1rem;" v-t="'badges_title'")
          badge-stripe(v-for="badge in profile.badges" :key="badge.uid" :value="badge")
        div(style="margin-top: 1rem;")
          p.heading(v-t="'recent_ranks_title'")
          player-recent-rank(
            v-for="rank in profile.recentRecords"
            :key="rank.id"
            :value="rank"
          )
      .column.is-three-quarters-widescreen.is-three-fifths
        .box.statistics-card
          .columns.is-multiline
            .column.is-one-third
              p.box-subtitle(v-t="'total_ranked_plays'")
              p.title(v-text="profile.activity.totalRankedPlays")
            .column.is-one-third
              p.box-subtitle(v-t="'total_cleared_notes'")
              p.title(v-text="commaSeparated(profile.activity.clearedNotes)")
            .column.is-one-third
              p.box-subtitle(v-t="'highest_max_combo'")
              p.title(v-text="commaSeparated(profile.activity.maxCombo)")
            .column.is-one-third
              p.box-subtitle(v-t="'avg_ranked_accuracy'")
              p.title(v-text="(profile.activity.averageRankedAccuracy * 100).toFixed(2) + '%'")
            .column.is-one-third
              p.box-subtitle(v-t="'total_ranked_score'")
              p.title(v-text="commaSeparated(profile.activity.totalRankedScore)")
            .column.is-one-third
              p.box-subtitle(v-t="'total_play_time'")
              p.title(v-text="profile.activity.totalPlayTime")
          .tabs.is-small.is-toggle: ul
            li(
              v-for="[title, mode] in [['chart_radio_ranked_plays', 'activity'], ['chart_radio_rating', 'rating'], ['chart_radio_avg_accuracy', 'accuracy']]"
              :key="mode"
              :class="{ 'is-active': chartMode === mode }"
              @click="chartMode = mode"
            )
              a(v-t="title")
          line-chart(v-if="profile.timeseries" :data="profile.timeseries" :mode="chartMode")
        .box.levels-box(v-if="(profile.user.featuredLevels.length > 0) || (profile.user.levels.length > 0)")
          .levels-box-container.has-featured(v-if="profile.user.featuredLevels.length > 0")
            p.subtitle(v-t="'levels_title'")
            .level-card-container.small
              level-card(v-for="level in profile.user.featuredLevels" :key="level.id" :value="level")
            nuxt-link.button.is-fullwidth.is-transparent(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id, featured: true } }")
              b-icon(icon="angle-double-right")
              span(v-t="{ path: 'levels_featured_all_btn', args: { count: profile.user.featuredLevelsCount }}")
          .levels-box-container(v-if="profile.user.levels.length > 0")
            p.subtitle(v-t="'levels_title'" v-if="profile.user.featuredLevels.length === 0")
            .level-card-container.small
              level-card(v-for="level in profile.user.levels" :key="level.id" :value="level")
            nuxt-link.button.is-fullwidth(:to="{ name: 'levels', query: { owner: profile.user.uid || profile.user.id } }")
              b-icon(icon="angle-double-right")
              span(v-t="{ path: 'levels_all_btn', args: { count: profile.user.levelsCount }}")
        .box(v-if="profile && profile.user && profile.user.collections && profile.user.collections.length > 0")
          p.subtitle(style="margin-bottom: 16px;" v-t="'collections_title'")
          .level-card-container.small.regular-levels-container
            collection-simple-card(v-for="collection in profile.user.collections" :key="collection.id" :value="collection")
          a.button.is-fullwidth(style="margin-top: 16px;")
            b-icon(icon="angle-double-right")
            span(v-t="{ path: 'collections_all_btn', args: { count: profile.user.collectionsCount }}")
        div(style="margin: 12px;")
          captcha(ref="captcha")
          thread(category="profile" :thread="profile.user.id")
</template>

<script>
import marked from 'marked'
import BadgeStripe from '@/components/player/BadgeStripe'
import Captcha from '@/components/Captcha'
import Thread from '@/components/comments/Thread'
import gql from 'graphql-tag'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import LevelCard from '@/components/level/LevelCard'
import CollectionSimpleCard from '@/components/collection/CollectionSimpleCard'
import LineChart from '@/components/profile/LineChart'
import PlayerInfoAvatar from '@/components/player/PlayerInfoAvatar'
import { handleErrorBlock } from '@/plugins/antd'
import { Meta } from '@/utils'
import { parseISO, addMinutes, isFuture } from 'date-fns'
import { loadFontAwesomeSvg } from '@/components/FontAwesomeDyn'

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
    backgroundImage {
      thumbnail
    }
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
    header {
      original
    }
    user {
      id
      uid
      name
      registrationDate
      avatar {
        large
      }
      collections(first: 3) {
        id
        uid
        cover {
          thumbnail
        }
        title
        slogan
        levelCount
        creationDate
      }
      collectionsCount
      lastSeen
      levelsCount(category: "!featured")
      featuredLevelsCount: levelsCount(category: "featured")
      levels(category: "!featured", first: 6) { ...LevelInfo }
      featuredLevels: levels(category: "featured", first: 6) { ...LevelInfo }
    }
    rating
    badges {
      uid
      title
      description
      metadata
    }
    recentRecords(limit: 10) {
      id
      date
      chart {
        id
        difficulty
        name
        type
        notesCount
        level {
          uid
          title
          bundle {
            backgroundImage {
             stripe
            }
          }
        }
      }
      score
      accuracy
    }
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
      cumulativeAccuracy
      cumulativeRating
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
    Thread,
    Captcha,
    BadgeStripe,
  },
  layout: 'background',
  async asyncData ({ app, $axios, params, error, store }) {
    const profile = await app.apolloProvider.defaultClient.query({
      query,
      variables: { uid: params.id }
    }).then(res => res.data?.profile)
      .catch(err => handleErrorBlock(err, error))
    if (!profile || !profile.user) {
      return error({ statusCode: 404, message: 'Profile not found' })
    }
    store.commit('setBackground', { source: profile.header?.original })
    const badgePromises = profile.badges.map((badge) => {
      const icon = badge.metadata?.fontawesome?.icon
      const pack = badge.metadata?.fontawesome?.pack || 'fas'
      if (icon) {
        return loadFontAwesomeSvg(pack, icon)
          .then((svg) => {
            badge.metadata.fontawesome.svg = svg
          })
      }
      return null
    }).filter(a => a)
    await Promise.all(badgePromises)
    return {
      profile,
    }
  },
  data: () => ({
    profile: null,
    chartMode: 'activity',
  }),
  computed: {
    bio () {
      return marked(this.profile.bio || 'There is no bio yet.')
    },
    online () {
      if (!this.profile.user.lastSeen) {
        return false
      }
      const date = parseISO(this.profile.user.lastSeen)
      const dateInFuture = addMinutes(date, 15)
      return isFuture(dateInFuture) // If last seen date + 15 min is in the future, then we're online
    }
  },
  methods: {
    commaSeparated (number) {
      if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      return '0'
    },
  },
  head () {
    const name = this.profile.user.name || this.profile.user.uid
    const meta = new Meta(name, this.profile.bio || '')
    meta.extend('author', name)
    if (this.profile.headerURL) {
      meta.extend('og:image', this.profile.headerURL)
    }
    return meta
  },
  i18n: {
    key: 'profile'
  }
}
</script>

<style lang="scss" scoped>
  .statistics-card {
    background: linear-gradient(to right bottom, $theme4, $theme5);
  }

  .header-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: 24px;
    $gutter-y: 32px;
    $gutter-x: 24px;
    .avatar-container {
      flex-shrink: 0;
      flex-grow: 1;
      padding: $gutter-y $gutter-x;
      // text-align: center;
    }
    .player-info-container {
      padding: $gutter-y $gutter-x;
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
  }
  .box.levels-box {
    padding: 0 !important;
  }
</style>
