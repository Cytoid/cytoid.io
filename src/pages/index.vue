<template lang="pug">
  div
    div.container.logo
      img(:src="require('@/assets/images/logo.png')")
      div.slogan A community-driven touchscreen music game
      div.download-button-group
        a-button.download-button.ele3(
          type="primary"
          size="large"
          @click="download"
        )
          div(style="display: flex; align-content: center; padding-top: 2px;")
            font-awesome-icon(:icon="['fab', 'app-store']" fixed-width style="margin-right: .5rem; font-size: 20px;")
            span.card-heading(style="color: white; margin-bottom: 0; text-align: center; margin-top: 2px; ") Download on App Store
        a-button.download-button.ele3(
          type="primary"
          size="large"
          @click="download"
        )
          div(style="display: flex; align-content: center; padding-top: 2px;")
            font-awesome-icon(:icon="['fab', 'google-play']" fixed-width style="margin-right: .5rem; font-size: 20px;")
            span.card-heading(style="color: white; margin-bottom: 0; text-align: center; margin-top: 2px; ") Download on Google Play

    .section: .container(style="margin-top: -10vh;")
      a-row(:gutter="16")
        a-col(:xs="24" :md="14" :lg="16")
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to top left, #B06AB3, #4568DC); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(ellipse farthest-corner at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 12px;")
              p.card-heading(style="color: white; margin: 12px; padding-top: 12px;") Cytoid News
              post-card.post-card(v-for="post in posts" :key="post.id" :value="post")
              div(style="")
                nuxt-link(:to="{ name: 'posts' }")
                  a-button(class="card-button" style="width: 100%;")
                    font-awesome-icon(icon="angle-double-right" fixed-width style="margin-right: 4px;")
                    span View previous news
          a-row(:gutter="16")
            a-col(:xs="24" :md="12")
              a-card(class="ranks-card" style="background: none; margin-bottom: 16px;")
                p.heading Recent ranks
                player-recent-rank(
                  v-for="rank in latestRanks.slice(0, 5)"
                  :key="rank.uid"
                  :rank="rank"
                  :showPlayer="true"
                )
            a-col(:xs="24" :md="12")
              a-card(class="ele3" style="margin-bottom: 16px;")
                | lol
        a-col(:xs="24" :md="10" :lg="8")
          a-card(class="ele3 gradient-card" style="margin-bottom: 16px;")
            div(class="gradient-card-header" style="background: linear-gradient(to right bottom, #b91d73, #f953c6); max-width: 256px;")
            div(class="gradient-card-header" style="background: radial-gradient(ellipse farthest-corner at 0 0, transparent, hsla(226, 15%, 19%, 1) 256px); z-index: 1")
            div(style="position: relative; z-index: 2; margin: 12px;")
              p.card-heading(style="color: white; margin: 12px; padding-top: 12px;") Latest featured level
              level-card.level-card(v-if="latestFeaturedLevel" :value="latestFeaturedLevel")
          a-card(class="ele3" style="margin-bottom: 16px;")
            | lol
</template>

<script>
import PlayerRecentRank from '@/components/player/PlayerRecentRank'
import PostCard from '@/components/post/PostCard'
import LevelCard from '@/components/level/LevelCard'

export default {
  layout: 'background',
  components: {
    PlayerRecentRank,
    PostCard,
    LevelCard,
  },
  background: {
    source: require('@/assets/images/sayaka.png'),
    overlayOpacity: 0.0001,
  },
  data() {
    return {
      posts: [
        {
          id: 0,
          uid: 0,
          title: 'New CytoidIO is up!',
          description: 'THuskdlghkshflks sdhjfklshdfl sdjflk',
          background: require('@/assets/images/bright.png'),
        },
        {
          id: 0,
          uid: 0,
          title: 'Google acquires Apple',
          description: 'askfalsjhflkshdfkskf',
          background: require('@/assets/images/dark.png'),
        },
        {
          id: 0,
          uid: 0,
          title: 'PTB10 is God',
          description: 'uaipdsljfkangsfo;dmkfsfs  siofs sjf; jaoslkfklsfj owiqdfklja IJSd;kfll',
          background: require('@/assets/images/normal.png'),
        },
      ],
      totalLevels: 0,
      latestFeaturedLevel: null,
      latestRanks: [],
    }
  },
  asyncData({ $axios, error }) {
    return Promise.all([
      $axios.get('/levels', { params: { sort: 'creation_date', order: 'desc', page: 0, limit: 0 } }),
      $axios.get('/levels', { params: { sort: 'creation_date', order: 'desc', page: 0, limit: 1, featured: true } }),
      $axios.get('/profile/mekko?stats=true')
    ])
      .then(([response1, response2, response3]) => {
        const ranks = response3.data.recents.ranks
        for (const rank of ranks) {
          rank.owner = {
            uid: 'mekko',
            avatarURL: 'https://www.gravatar.com/avatar/afb6bb59bee2a480e255f66a64e27098'
          }
        }
        return {
          totalLevels: parseInt(response1.headers['x-total-entries']),
          latestFeaturedLevel: response2.data.length > 0 ? response2.data[0] : null,
          latestRanks: ranks
        }
      })
      .catch(err => error(err.response?.data))
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

  .ranks-card .ant-card-body {
    padding-bottom: 8px;
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
