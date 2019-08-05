<template lang="pug">
  div
    div.container.logo
      img(:src="require('@/assets/images/logo.png')")
      .slogan A community-driven touchscreen music game
      .download-button-group
        a(href="https://itunes.apple.com/us/app/cytoid/id1266582726" target="_blank")
          a-button.download-button.ele3(
            type="primary"
            size="large"
          )
            div(style="display: flex; align-content: center; padding-top: 2px;")
              font-awesome-icon(:icon="['fab', 'app-store']" fixed-width style="margin-right: .5rem; font-size: 20px;")
              span.card-heading(style="color: white; margin-bottom: 0; text-align: center; margin-top: 2px; ") Download on App Store
        a(href="https://play.google.com/store/apps/details?id=me.tigerhix.cytoid" target="_blank")
          a-button.download-button.ele3(
            type="primary"
            size="large"
          )
            div(style="display: flex; align-content: center; padding-top: 2px;")
              font-awesome-icon(:icon="['fab', 'google-play']" fixed-width style="margin-right: .5rem; font-size: 20px;")
              span.card-heading(style="color: white; margin-bottom: 0; text-align: center; margin-top: 2px; ") Download on Google Play
    .section: .container(style="margin-top: -10vh;")
      a-row(:gutter="16")
        a-col(:xs="24" :md="14" :lg="16")
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to top left, #B06AB3, #4568DC); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(circle farthest-corner at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 12px;")
              p.card-heading(style="color: white; margin: 12px; padding-top: 12px;") Cytoid News
              div(v-for="post in posts" :key="post.slug")
                nuxt-link(:to="{ name: 'posts-id', params: { id: post.slug } }")
                  post-card.post-card(:post="post")
              div(v-show="false")
                nuxt-link(:to="{ name: 'posts' }")
                  a-button(class="card-button" style="width: 100%;")
                    font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                    span View previous news
        a-col(:xs="24" :md="10" :lg="8")
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to right bottom, #b91d73, #f953c6); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(circle farthest-corner at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 12px;")
              p.card-heading(style="color: white; margin: 12px; padding-top: 12px;") Latest featured level
              level-card.level-card(v-if="latestFeaturedLevel" :value="latestFeaturedLevel")
          nuxt-link(:to="{ name: 'levels' }")
            a-button.browse-button.ele3(
              type="primary"
              size="large"
              style="width: 100%; color: white; font-size: 12px; text-transform: uppercase; font-weight: bold;"
            )
              | Browse all {{ totalLevels }} levels!
      a-row(:gutter="16")
        a-col(:xs="24" :lg="8")
          p.heading(style="padding-top: 24px; margin-bottom: 12px;") Recent ranks
          player-recent-rank(
            v-for="rank in latestRanks"
            :key="rank.uid"
            :rank="rank"
            :showPlayer="true"
            style="margin: 8px 0;"
          )
        a-col(:xs="24" :lg="8")
          p.heading(style="padding-top: 24px; margin-bottom: 12px;") Latest tweet
          a-spin(:spinning="loadingTweet" style="min-height: 128px;")
            p(v-show="loadTweetFailed") Cannot fetch latest tweet.
            Tweet(v-show="!loadingTweet && !loadTweetFailed" :id="latestTweetId" :key="latestTweetId" :options="{ theme: 'dark' }")
          p.heading(style="padding-top: 24px; margin-bottom: 12px;") New comments
          a-spin(:spinning="loadingComments" style="min-height: 128px;")
            p(v-show="loadCommentsFailed") Cannot fetch Disqus comments.
            player-recent-comment(
              v-for="comment in latestComments"
              :key="comment.uid"
              :comment="comment"
              style="margin: 8px 0;"
            )
        a-col(:xs="24" :lg="8")
          p.heading(style="padding-top: 24px; margin-bottom: 12px;") Connect
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to right bottom, #7289DA, #7289DA); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(100% 160px at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 32px 32px 24px 32px;")
              img(:src="require('@/assets/images/discord.png')" style="width: 110px;")
              p(v-show="onlineDiscordMembersCount > 0" style="margin-top: 24px; color: rgba(255, 255, 255, 0.7);")
                | {{ onlineDiscordMembersCount }} members online
              p(style="margin-top: 8px")
                | Join our Discord community for charting help, weekly tournaments,
                |
                span(style="text-decoration: line-through;") memes
                |
                | and more!
              a(href="https://discord.gg/cytoid")
                a-button(class="card-button" style="width: 100%;")
                  font-awesome-icon(icon="sign-in" fixed-width style="margin-right: 4px;")
                  span Join the community!
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to right bottom, #F96854, #F96854); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(100% 160px at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 20px 32px 24px 32px;")
              img(:src="require('@/assets/images/patreon.png')" style="width: 150px;")
              p(style="margin-top: 24px").
                Cytoid is #[strong 100% free] and #[strong open-source].
                However, keeping the game servers running costs #[em $$$]. Maybe you can...
              a(href="https://www.patreon.com/tigerhix")
                a-button.card-button(style="width: 100%;")
                  font-awesome-icon(icon="heart" fixed-width style="margin-right: 4px;")
                  | Become a patron!
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to right bottom, hsla(260, 71%, 66%, 1), hsla(260, 71%, 66%, 1)); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(100% 160px at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 32px 32px 24px 32px;")
              img(:src="require('@/assets/images/afdian.png')" style="width: 110px;")
              p(style="margin-top: 24px")
                | Cytoid 是 100% 免费并且开源的音乐游戏。不过，服务器的运营费用十分高昂。喜欢 Cytoid 的话，不妨考虑...
              a(href="https://afdian.net/@tigerhix")
                a-button(class="card-button" style="width: 100%;")
                  font-awesome-icon(icon="mug-hot" fixed-width style="margin-right: 4px;")
                  span 请作者喝咖啡
    script(src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async defer)
</template>

<script>
import { Tweet } from 'vue-tweet-embed'
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import PlayerRecentComment from '@/components/player/PlayerRecentComment'
import PostCard from '@/components/post/PostCard'
import LevelCard from '@/components/level/LevelCard'

export default {
  layout: 'background',
  components: {
    PlayerRecentRank,
    PlayerRecentComment,
    PostCard,
    LevelCard,
    Tweet
  },
  background: {
    source: require('@/assets/images/sayaka.png'),
    overlayOpacity: 0.0001,
  },
  data() {
    return {
      posts: [],
      totalLevels: 0,
      latestFeaturedLevel: null,
      latestRanks: [],
      latestComments: [],
      latestTweetId: 'tweet-does-not-exist',
      onlineDiscordMembersCount: -1,
      loadingComments: true,
      loadCommentsFailed: false,
      loadingTweet: true,
      loadTweetFailed: false,
      styleTweetTimer: null,
    }
  },
  asyncData({ $axios, error }) {
    return Promise.all([
      $axios.get(process.env.cmsURL + `/api/items/posts?fields=*.*`),
      $axios.get('/levels', { params: { sort: 'creation_date', order: 'desc', page: 0, limit: 0 } }),
      $axios.get('/levels', { params: { sort: 'creation_date', order: 'desc', page: 0, limit: 1, featured: true } }),
      $axios.get('/records')
    ])
      .then(([postsResponse, totalLevelsResponse, latestFeaturedLevelResponse, latestRanksResponse]) => {
        return {
          posts: postsResponse.data.data,
          totalLevels: parseInt(totalLevelsResponse.headers['x-total-entries']),
          latestFeaturedLevel: latestFeaturedLevelResponse.data.length > 0 ? latestFeaturedLevelResponse.data[0] : null,
          latestRanks: latestRanksResponse.data.slice(0, 5)
        }
      })
      .catch(err => error(err.response?.data))
  },
  mounted() {
    this.$axios.get('/integrations/disqus').then((response) => {
      this.latestComments = response.data.response
      this.loadingComments = false
    }).catch((err) => {
      this.loadCommentsFailed = true
      console.log(err)
    })
    this.$axios.get('/integrations/twitter').then((response) => {
      this.latestTweetId = response.data[0].id_str
      const self = this
      function styleTweet() {
        const widget = document.querySelector('[id^="twitter-widget-"]')
        if (widget == null) {
          // Try next time!
          self.styleTweetTimer = setTimeout(styleTweet, 200)
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

        self.loadingTweet = false
      }
      this.styleTweetTimer = setTimeout(styleTweet, 200)
    }).catch((err) => {
      this.loadTweetFailed = true
      console.log(err)
    })
    this.$axios.get('/integrations/discord').then((response) => {
      this.onlineDiscordMembersCount = response.data.members.length
    }).catch((err) => {
      console.log(err)
    })
    const self = this
    function loadCrate() {
      if (self.$store.crate != null) {
        self.$store.crate.show()
        return
      }
      if (typeof Crate !== 'function') {
        // Try again!
        setTimeout(loadCrate, 100)
        return
      }
      // eslint-disable-next-line no-undef
      self.$store.crate = new Crate({
        server: '362884768498712579',
        channel: '362884769333248001',
        shard: 'https://disweb.deploys.io'
      })
    }
    setImmediate(loadCrate)
  },
  destroyed() {
    if (this.styleTweetTimer) {
      clearTimeout(this.styleTweetTimer)
      this.styleTweetTimer = null
    }
    if (this.$store.crate) {
      this.$store.crate.hide()
    }
  }
}
</script>

<style lang="less" scoped>
  .download-button.ant-btn-primary {
    background: linear-gradient(to right, @theme4, @theme6);
    border: none;
    background-size: 200% 100%;
    margin-bottom: 16px;
    @media(min-width: 768px) {
      margin-left: 24px;
    }

    &:hover {
      background: linear-gradient(to right, @theme4, @theme6);
      background-size: 200% 100%;
      transform: scale(0.98, 0.98);
    }

    &:active, &:focus {
      background: linear-gradient(to right, @theme4, @theme6);
      background-size: 200% 100%;
      box-shadow: @ele3;
      transform: scale(0.95, 0.95);
    }
  }
  .browse-button.ant-btn-primary {
    background: linear-gradient(270deg, #21d4fd, #b721ff);
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
      background: linear-gradient(270deg, #21d4fd, #b721ff);
      background-size: 400% 400%;
      transform: scale(0.98, 0.98);
    }

    &:active, &:focus {
      box-shadow: @ele3;
      background: linear-gradient(270deg, #21d4fd, #b721ff);
      background-size: 400% 400%;
      transform: scale(0.95, 0.95);
    }

  }
</style>

<style lang="less">
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
  }

  .slogan {
    text-shadow: 0 2px 2px rgba(0, 0, 0, 0.4);
    font-size: 16px;
    @media (min-width: 768px) {
      margin-left: 24px;
    }
  }

  .gradient-card .ant-card-body {
    padding: 0;
  }

  .gradient-card .gradient-card-header {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }

  .post-card, .level-card {
    margin-bottom: 12px;
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
