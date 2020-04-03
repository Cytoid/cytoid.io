<template lang="pug">
  div(v-if="data")
    .container.logo
      img(:src="require('@/assets/images/logo.png')")
      .slogan(v-t="'slogan'")
      .download-button-group
        a(href="https://itunes.apple.com/us/app/cytoid/id1266582726" target="_blank")
          a-button.download-button.ele3(
            type="primary"
            size="large"
          )
            div(style="display: flex; align-content: center; padding-top: 2px;")
              font-awesome-icon(:icon="['fab', 'app-store']" fixed-width style="margin-right: .5rem; font-size: 20px;")
              span.card-heading(style="color: white; margin-bottom: 0; text-align: center; margin-top: 2px; " v-t="'download_appstore'")
        a(href="https://play.google.com/store/apps/details?id=me.tigerhix.cytoid" target="_blank")
          a-button.download-button.ele3(
            type="primary"
            size="large"
          )
            div(style="display: flex; align-content: center; padding-top: 2px;")
              font-awesome-icon(:icon="['fab', 'google-play']" fixed-width style="margin-right: .5rem; font-size: 20px;")
              span.card-heading(style="color: white; margin-bottom: 0; text-align: center; margin-top: 2px; " v-t="'download_googleplay'")
    .section: .container(style="margin-top: -10vh;")
      .columns
        .column.is-two-thirds-desktop.is-three-fifths-tablet
          #posts.box.is-gradient
            p.card-heading(v-t="'news_title'")
            post-card.post-card(v-for="post in posts" :key="post.slug" :value="post")
            div(v-if="false")
              nuxt-link(:to="{ name: 'posts' }")
                a-button.card-button(style="width: 100%;")
                  font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                  span(v-t="'news_previous'")
        .column.is-one-third-desktop.is-two-fifths-tablet
          #index-featured-collection.box.is-gradient(v-if="data && data.gettingStarted")
            p.card-heading(v-t="'featured_collection_title'")
            collection-simple-card(:value="data.gettingStarted")
          nuxt-link(:to="{ name: 'collections' }")
            a-button.browse-button.ele3(
              type="primary"
              size="large"
              style="width: 100%; color: white; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 1.5rem;"
            ) {{$t('collection_all_btn', { count: (data && data.collectionsCount) })}}
          #index-featured-level.box.is-gradient(v-if="data.latestFeaturedLevels && data.latestFeaturedLevels[0]")
            p.card-heading(v-t="'featured_level_title'")
            level-card.level-card(:value="data.latestFeaturedLevels[0]")
          nuxt-link(:to="{ name: 'levels' }")
            a-button.browse-button.ele3(
              type="primary"
              size="large"
              style="width: 100%; color: white; font-size: 12px; text-transform: uppercase; font-weight: bold;"
            ) {{$t('level_all_btn', { count: data.levelsCount })}}
      collection-preview-card(v-if="data && data.hitech" :value="data.hitech")
      .columns
        .column.is-one-third-desktop.is-half-tablet
          p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'recent_ranks_title'")
          player-recent-rank(
            v-if="data.recentRecords"
            v-for="record in data.recentRecords"
            :key="record.id"
            :value="record"
            :showPlayer="true"
            style="margin: 8px 0;"
          )
        .column.is-one-third-desktop.is-half-tablet
          p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'latest_tweet_title'")
          Tweet(v-if="data.recentTweet" v-show="!loadingTweet" :id="data.recentTweet" :key="data.recentTweet" :options="{ theme: 'dark' }")
          p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'new_comments_title'")
          player-recent-comment(
            v-for="comment in data.disqus"
            :key="comment.uid"
            :comment="comment"
            style="margin: 8px 0;"
          )
        .column.is-one-third-desktop.is-half-tablet
          p.heading(style="padding-top: 24px; margin-bottom: 12px;" v-t="'connect_title'")
          #discord.box.is-gradient
            img(:src="require('@/assets/images/discord.png')" style="width: 110px;")
            p(
              v-show="data.discordOnlineCount > 0"
              style="margin-top: 24px; color: rgba(255, 255, 255, 0.7);"
              v-t="{path: 'connect_discord_subtitle', args: { count: data.discordOnlineCount }}"
            )
            p(style="margin-top: 8px" v-t="'connect_discord_content'")
            a(href="https://discord.gg/cytoid")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="sign-in" fixed-width style="margin-right: 4px;")
                span(v-t="'connect_discord_btn'")
          #patron.box.is-gradient
            img(:src="require('@/assets/images/patreon.png')" style="width: 150px;")
            p(style="margin-top: 24px" v-t="'connect_patreon_content'")
            a(href="https://www.patreon.com/tigerhix")
              a-button.card-button(style="width: 100%;")
                font-awesome-icon(icon="heart" fixed-width style="margin-right: 4px;")
                | Become a patron!
          #afdian.box.is-gradient
            img(:src="require('@/assets/images/afdian.png')" style="width: 110px;")
            p(style="margin-top: 24px")
              | Cytoid 是 100% 免费并且开源的音乐游戏。不过，服务器的运营费用十分高昂。喜欢 Cytoid 的话，不妨考虑...
            a(href="https://afdian.net/@tigerhix")
              a-button(class="card-button" style="width: 100%;")
                font-awesome-icon(icon="mug-hot" fixed-width style="margin-right: 4px;")
                span 请作者喝咖啡
</template>

<script>
import { Tweet } from 'vue-tweet-embed'
import gql from 'graphql-tag'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import PlayerRecentComment from '@/components/player/PlayerRecentComment'
import PostCard from '@/components/post/PostCard'
import LevelCard from '@/components/level/LevelCard'
import CollectionPreviewCard from '@/components/collection/CollectionPreviewCard'
import CollectionSimpleCard from '@/components/collection/CollectionSimpleCard'
import ScoreBadge from '@/components/level/ScoreBadge'
import DifficultyBadge from '@/components/level/DifficultyBadge'

const query = gql`
query FetchHomePage {
  disqus
  recentTweet
  discordOnlineCount
  collectionsCount
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
  layout: 'background',
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
  background: {
    source: require('@/assets/images/cryout.jpg'),
    landing: true
  },
  apollo: {
    data: {
      query,
      update: data => data,
    }
  },
  data() {
    return {
      posts: [],
      loadingTweet: false,
    }
  },
  asyncData({ $axios, error }) {
    return Promise.all([
      $axios.get(process.env.cmsURL + '/api/items/posts?fields=*.*&sort=-created_on'),
    ])
      .then(([postsResponse]) => {
        return {
          posts: postsResponse.data.data.filter(it => it.published),
        }
      })
      .catch(err => error(err.response?.data))
  },
  mounted() {
    function styleTweet() {
      const widget = document.querySelector('[id^="twitter-widget-"]')
      if (widget == null) {
        // Try next time!
        this.styleTweetTimer = setTimeout(styleTweet, 200)
        return
      }
      const style = document.createElement('style')
      style.innerHTML = `
        .EmbeddedTweet {
          border: none !important;
          background: hsla(226, 15%, 19%, 1) !important;
          box-shadow: 0 10px 20px hsla(0, 0%, 0%, .10), 0 3px 6px hsla(0, 0%, 0%, .066);
        }
        .CallToAction {
          border: none !important;
        }
        .CallToAction-icon .Icon {
          display: none !important;
        }
        .CallToAction-text {
          margin-left: -2px !important;
          color: rgba(255, 255, 255, 0.8) !important;
          transition: 0.2s cubic-bezier(0.23, 1, 0.32, 1) !important;
        }
        .CallToAction-text:hover {
          color: white !important;
        }
      `
      style.type = 'text/css'
      if (widget.contentDocument) {
        widget.contentDocument.head.appendChild(style)
      } else {
        widget.shadowRoot.insertBefore(style, widget.shadowRoot.childNodes[0])
      }

      this.loadingTweet = false
    }
    this.styleTweetTimer = setTimeout(styleTweet.bind(this), 200)
  },
  destroyed() {
    if (this.styleTweetTimer) {
      clearTimeout(this.styleTweetTimer)
      this.styleTweetTimer = null
    }
  },
  i18n: {
    key: 'homepage'
  }
}
</script>

<style lang="less" scoped>
  .download-button.ant-btn-primary {
    background: linear-gradient(to right, @theme4, @theme6) !important;
    border: none;
    background-size: 200% 100%;
    margin-bottom: 16px;
    @media(min-width: 768px) {
      margin-left: 24px;
    }

    &:hover {
      background: linear-gradient(to right, @theme4, @theme6) !important;
      background-size: 200% 100%;
      transform: scale(0.98, 0.98) !important;
    }

    &:active, &:focus {
      background: linear-gradient(to right, @theme4, @theme6) !important;
      background-size: 200% 100%;
      box-shadow: @ele3;
      transform: scale(0.95, 0.95) !important;
    }
  }
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
      box-shadow: @ele3 !important;
      background: linear-gradient(270deg, #21d4fd, #b721ff) !important;
      background-size: 400% 400% !important;
      transform: scale(0.95, 0.95) !important;
    }

  }
</style>

<style scoped lang="less">
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;

  img {
    max-width: 400px;
  }

  @media (min-width: 768px) {
    align-items: start;
  }
  .slogan {
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
    font-size: 16px;
    @media (min-width: 768px) {
      margin-left: 24px;
    }
  }
}
.download-button-group {
  margin-top: 24px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  @media(min-width: 768px) {
    flex-direction: row;
  }
}
</style>

<style lang="scss" scoped>
.box {
  .card-heading {
    color: white;
    margin: .75rem;
  }
  &#index-featured-collection {
    --box-background-gradient: linear-gradient(to right bottom, #acb6e5, #86fde8);
    padding: .75rem;
  }
  &#index-featured-level {
    --box-background-gradient: linear-gradient(to right bottom, #b91d73, #f953c6);
    padding: .75rem;
  }
  &#discord {
    --box-background-gradient: linear-gradient(to right bottom, #7289DA, #7289DA);
  }
  &#patron {
    --box-background-gradient: linear-gradient(to right bottom, #F96854, #F96854);
  }
  &#afdian {
    --box-background-gradient: linear-gradient(to right bottom, hsla(260, 71%, 66%, 1), hsla(260, 71%, 66%, 1));
  }
  &#posts {
    --box-background-gradient: linear-gradient(to top left, #B06AB3, #4568DC);
    padding: .75rem;
  }
}

.post-card {
  padding-top: 37.5%;
  @media(min-width: 1024px) {
    padding-top: 22.5%;
  }
  &:not(:last-child) {
    margin-bottom: 12px;
  }
}
</style>
