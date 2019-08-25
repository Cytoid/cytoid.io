<template lang="pug">
.navcard
  div.navcard-avatar
    player-info-avatar(
      :exp="exp"
      :avatar="$store.state.avatar"
      :rating="rating"
    )
  img.navcard-header(v-if="header" :src="$img(header, { maxHeight: 1024 })")
  div.navcard-header(v-else style="background: linear-gradient(to right bottom, hsla(226, 68%, 57%, 1), hsla(226, 68%, 67%, 1))")
  div.navcard-uid(v-text="user.uid")
  .navcard-grid
    nuxt-link.navcard-item(:to="{ name: 'profile-id', params: { id: $store.state.user.uid || $store.state.user.id } }")
      font-awesome-icon.icon(:icon="['fas', 'user']")
      .title Profile
    nuxt-link.navcard-item(to="/studio")
      font-awesome-icon.icon(:icon="['fas', 'puzzle-piece']")
      .title My Content
    .navcard-item
      font-awesome-icon.icon(:icon="['fas', 'heart']")
      .title Favorites
    nuxt-link.navcard-item(to="/settings")
      font-awesome-icon.icon(:icon="['fas', 'cog']")
      .title Settings
  .section
    a-button(type="danger" block @click="logout") Sign Out
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
  },
  mounted() {
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
        console.log(expRes)
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
@header-height: 292px;
@icon-size: 24px;
@avatar-size: 128px;
.navcard {
  background-color: #fff;
  width: 80vw;
  max-width: 330px;
  position: relative;
  .navcard-header {
    width: 100%;
    height: @header-height;
    margin-bottom: @avatar-size / 2;
    object-fit: cover;
    object-position: center;
  }
  .navcard-avatar {
    position: absolute;
    left: calc(50% - @avatar-size / 2);
    top: @avatar-size / 2;
  }
  .navcard-uid {
    color: white;
    text-shadow: @text-ele;
    margin-top: -128px;
    text-align: center;
    font-size: 24px;
  }
  .navcard-grid {
    display: grid;
    grid-template-columns: 50% 50%;
    padding: 28px 0 0 0;
    .navcard-item {
      padding: 24px;
      color: @theme5;
      &:hover {
        transform: scale(1.1);
      }
      .icon {
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: @icon-size;
        height: @icon-size;
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
