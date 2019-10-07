<template lang="pug">
.navcard
  .navcard-header(:style="{'background-image': `url(${$img(header, { height: 1024 })})`}")
    .navcard-header-mask(:style="{ opacity: header ? '.5' : null }")
    .navcard-avatar
      player-info-avatar(
        :exp="exp"
        :avatar="$store.state.avatar"
        :rating="rating"
      )
    .navcard-uid(v-if="roleIcon")
      font-awesome-icon(:icon="roleIcon")
    .navcard-uid(v-text="user.uid || user.name")
  .navcard-grid
    nuxt-link.navcard-item(:to="{ name: 'profile-id', params: { id: $store.state.user.uid || $store.state.user.id } }")
      font-awesome-icon.icon(:icon="['fas', 'user']")
      .title Profile
    nuxt-link.navcard-item(to="/studio")
      font-awesome-icon.icon(:icon="['fas', 'puzzle-piece']")
      .title Studio
    .navcard-item.navcard-item-disabled
      font-awesome-icon.icon(:icon="['fas', 'heart']")
      .title Favorites
    nuxt-link.navcard-item(to="/settings")
      font-awesome-icon.icon(:icon="['fas', 'cog']")
      .title Settings
  .section
    a-button(class="card-button-light" style="width: 100%;" @click="logout")
      font-awesome-icon(icon="sign-out" fixed-width style="margin-right: 4px;")
      span Sign out
</template>

<script>
import { mapState } from 'vuex'
import PlayerInfoAvatar from '@/components/player/PlayerInfoAvatar'
export default {
  name: 'NavCard',
  components: { PlayerInfoAvatar },
  data() {
    return {
      exp: { basicExp: -1, levelExp: -1, totalExp: -1, currentLevel: -1, nextLevelExp: -1, currentLevelExp: -1 },
      rating: -1
    }
  },
  computed: {
    ...mapState(['header', 'user']),
    roleIcon() {
      return {
        moderator: 'user-tie',
        admin: 'user-cog'
      }[this.user.role]
    }
  },
  mounted() {
    console.log('hello? anyone?', this.user)
    if (this.user && !this.header) {
      this.$axios.get('/profile/' + this.user.id)
        .then((res) => {
          this.$store.commit('setHeader', res.data.headerURL)
          this.$store.commit('setAvatar', res.data.user.avatarURL)
        })
    }
    if (this.user) {
      Promise.all([
        this.$axios.get(`/profile/${this.$store.state.user.id}/exp`),
        this.$axios.get(`/profile/${this.$store.state.user.id}/rating`)
      ]).then(([expRes, rtRes]) => {
        this.exp = expRes.data
        this.rating = rtRes.data
      })
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => this.$router.push('/'))
    }
  },
}
</script>

<style lang="less">
.navcard {
  user-select: none;
  background-color: #fff;
  width: 80vw;
  max-width: 330px;
  .navcard-header {
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 36px;
    position: relative;
    .navcard-header-mask {
      right: 0;
      bottom: 0;
      left: 0;
      top: 0;
      position: absolute;
      background: linear-gradient(to right bottom, hsla(226, 68%, 57%, 1), hsla(226, 68%, 67%, 1));
    }
  }
  .navcard-avatar {
    text-align: center;
    padding: 40px 20px;
    z-index: 1;
    position: relative;
  }
  .navcard-uid {
    color: white;
    text-shadow: @text-ele;
    text-align: center;
    font-size: 24px;
    z-index: 1;
    position: relative;
  }
  .navcard-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 36px 0 0 0;
    .navcard-item {
      padding: 24px;
      color: @theme5;
      transition: 0.4s @hoverEasing;
      &:hover {
        transform: scale(1.05);
      }
      &:active {
        transform: scale(0.95);
      }
      .icon {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 24px;
        height: 24px;
        :before {
          background: -webkit-gradient(linear, left top, left bottom, from(#f00), to(#333));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: initial; /* reset Font Awesome's display:inline-block */
        }
      }
      .title {
        text-align: center;
        margin-top: 4px;
        font-weight: bold;
      }
    }
    .navcard-item-disabled {
      color: rgba(0, 0, 0, 0.5);
      &:hover {
        transform: none;
      }
      &:active {
        transform: none;
      }
    }
  }
  .card-button-light {
    border: none;
    font-size: 12px;
    font-weight: bold;
    color: white !important;
    margin-bottom: 4px;
    text-transform: uppercase;
    background: hsla(226, 15%, 19%, 1) !important;
    transition: 0.2s @hoverEasing;
    &:hover, &:active, &:focus {
      background: hsla(226, 15%, 19%, 0.7) !important;
      color: white !important;
    }
    &:disabled {
      background: rgba(0, 0, 0, 0.5) !important;
      color: rgba(255, 255, 255, 0.3) !important;
    }
  }
}
</style>

<style>
.ant-popover-inner {
  overflow: hidden;
}
.ant-popover-inner-content {
  padding: 0;
}
</style>
