<template lang="pug">
.container
  .section: .container.error-texts
    h1(v-t="'404_title'")
    h2(v-t="{path: 'error_content', args: { error: message }}")
    nuxt-link(to="/")
  .section: .explanation.container.error-texts
    p(v-t="'explanation'")
  b-loading(is-full-page :active="!data" style="display:none")
  template(v-if="data")
    .section: .container
      .columns
        .column.is-half-desktop
          p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'connect_title'")
          #discord.box.is-gradient
            img(:src="require('@/assets/images/discord.png')" style="width: 110px;")
            p(
              v-show="data.discordOnlineCount > 0"
              style="margin-top: 24px; color: rgba(255, 255, 255, 0.7);"
              v-t="{path: 'connect_discord_subtitle', args: { count: data.discordOnlineCount }}"
            )
            p(style="margin-top: 0.5rem; margin-bottom: 0.5rem;" v-t="'connect_discord_content'")
            b-button(expanded href="https://discord.gg/cytoid" tag="a" icon-left="sign-in" type="is-transparent")
              span(v-t="'connect_discord_btn'")
      .recent-rank-box
        p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'recent_ranks_title'")
        player-recent-rank(
          v-if="data.recentRecords"
          v-for="record in data.recentRecords"
          :key="record.id"
          :value="record"
          :showPlayer="true"
          style="margin: 8px 0;"
        )
        .more-level-box
          nuxt-link.button.is-browse.is-large.is-fullwidth.is-fullheight.is-title(:to="{ name: 'levels' }")
            span(v-t="{ path: 'featured_level_btn', args: { count: data.levelsCount }}")
          nuxt-link.button.is-browse.is-large.is-fullwidth.is-fullheight.is-title(:to="{ name: 'levels' }")
            span(v-t="{ path: 'level_all_btn', args: { count: data.levelsCount }}")

</template>

<script>
import { Tweet } from 'vue-tweet-embed'
import gql from 'graphql-tag'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import PlayerRecentComment from '@/components/player/PlayerRecentComment'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'
import PostCard from '@/components/post/PostCard'
import LevelCard from '@/components/level/LevelCard'
import CollectionPreviewCard from '@/components/collection/CollectionPreviewCard'
import CollectionSimpleCard from '@/components/collection/CollectionSimpleCard'

const query = gql`
query FetchHomePage {
  recentTweet
  discordOnlineCount
  collectionsCount
  comments: recentComments(limit: 5) {
    id
    category
    key
    content
    date
    owner {
      id
      uid
      name
      avatar {
        small
      }
    }
    metadata
  }
  posts: getActivePosts(limit: 10) {
    id
    uid
    title
    slogan
    cover {
      stripe
    }
    creationDate
  }
  gettingStarted: collection(uid: "getting-started") {
    ...CollectionInfoFragment
    levelCount
  }
  hitech: collection(uid: "hi-tech") {
    ...CollectionInfoFragment
    levels(limit: 5) {
      ...LevelCardFragment
    }
  }
  latestFeaturedLevels: levels(category: "featured", limit:1, sort: CREATION_DATE, order:DESC) {
    ...LevelCardFragment
  }
  levelsCount
  recentRecords(ranked:true, limit:10) {
    id
    date
    owner {
      id
      uid
      name
      avatar {
        small
      }
    }
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
    rank
  }
}
fragment LevelCardFragment on Level {
  id
  uid
  title
  owner {
    id
    uid
    name
    avatar {
      small
    }
  }
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
    musicPreview
  }
}
fragment CollectionInfoFragment on Collection {
  id
  uid
  title
  slogan
  cover {
    thumbnail
  }
  owner {
    id
    uid
    name
    avatar {
      small
    }
  }
}
`
export default {
  name: 'ErrorLayout',
  layout: 'default',
  components: {
    PlayerRecentRank,
    PlayerRecentComment,
    PostCard,
    LevelCard,
    CollectionPreviewCard,
    CollectionSimpleCard,
    ScoreBadge,
    DifficultyBadge,
    Tweet
  },
  props: {
    error: {
      type: Object,
      required: true,
    }
  },
  computed: {
    message () {
      if (!this.error) {
        return null
      }
      return this.error.message
    }
  },
  head () {
    return {
      htmlAttrs: {
        lang: this.$store.state.locale,
      }
    }
  },
  data () {
    return {
      posts: [],
      loadingTweet: false,
      data: null,
    }
  },
  mounted () {
    this.$apollo.query({
      query,
    })
      .then((res) => {
        this.data = res.data
        console.log(res)
      })
  },
  i18n: {
    key: 'error_page'
  }
}
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;

  img {
    max-width: 400px;
  }
  .buttons-container {
    @include mobile {
      display: flex;
      flex-direction: column;
      margin-top: 24px;
      .button {
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
    @include tablet {
      margin-left: 0.5rem;
      .button {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
      }
    }
  }

  @include tablet {
    align-items: start;
  }
  .slogan {
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
    font-size: $size-medium;
    color: white;
    @include tablet {
      margin-left: 1rem;
      margin-bottom: 1rem;
    }
  }
}
</style>

<style lang="scss" scoped>
  .browse-button.ant-btn-primary {
    background: linear-gradient(270deg, #21d4fd, #b721ff) !important;
    background-size: 400% 400%;

    -webkit-animation: flow 25s ease infinite;
    -moz-animation: flow 25s ease infinite;
    animation: flow 25s ease infinite;

    @-webkit-keyframes flow {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @-moz-keyframes flow {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @keyframes flow {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }

    &:hover {
      background: linear-gradient(270deg, #21d4fd, #b721ff) !important;
      background-size: 400% 400%;
      transform: scale(0.98, 0.98) !important;
    }

    &:active, &:focus {
      box-shadow: $ele3 !important;
      background: linear-gradient(270deg, #21d4fd, #b721ff) !important;
      background-size: 400% 400% !important;
      transform: scale(0.95, 0.95) !important;
    }

  }
</style>

<style lang="scss" scoped>
.error-texts {
  align-items: start;
  padding-left: 1rem;
  h1 {
    font-size: xxx-large;
  }
  h2 {
    font-size: 1.2rem;
  }
}
a.button {
  margin: 1rem 0;
}
@media screen and (min-width: 769px) {
  .recent-rank-box {
    p {
      grid-column-start: 1;
      grid-column-end: 3;
    }
    .more-level-box {
      grid-column-start: 1;
      grid-column-end: 3;
    }
    display: grid;
    grid-template-columns: 48% 48%;
    grid-column-gap: 2rem;
  }
}
@media screen and (min-width: 1024px) {
  .recent-rank-box {
    p {
      grid-column-start: 1;
      grid-column-end: 4;
    }
    .more-level-box {
      grid-column-start: 2;
      grid-column-end: 4;
    }
    display: grid;
    grid-template-columns: 30% 30% 30%;
    grid-column-gap: 2rem;
  }
}
</style>
