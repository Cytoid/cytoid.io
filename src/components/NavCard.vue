<template lang="pug">
.navcard
  .navcard-header(v-if="profile" :style="{'background-image': `url(${profile.header && profile.header.thumbnail}`}")
    .navcard-header-mask(:style="{ opacity: profile.header ? '.5' : null }")
    .navcard-avatar
      player-info-avatar(
        :exp="profile.exp"
        :avatar="profile.user.avatar.original"
        :rating="profile.rating"
      )
    .navcard-uid(v-if="roleIcon")
      font-awesome-icon(:icon="roleIcon")
    .navcard-uid(v-text="user.uid || user.name")
  .navcard-grid
    nuxt-link.navcard-item(:to="{ name: 'profile-id', params: { id: $store.state.user.uid || $store.state.user.id } }")
      font-awesome-icon.icon(:icon="['fas', 'user']")
      .navcard-title(v-t="'profile'")
    nuxt-link.navcard-item(to="/studio")
      font-awesome-icon.icon(:icon="['fas', 'puzzle-piece']")
      .navcard-title(v-t="'studio'")
    .navcard-item.navcard-item-disabled
      font-awesome-icon.icon(:icon="['fas', 'heart']")
      .navcard-title(v-t="'favorites'")
    nuxt-link.navcard-item(to="/settings")
      font-awesome-icon.icon(:icon="['fas', 'cog']")
      .navcard-title(v-t="'settings'")
  .section
    button.button.is-fullwidth(@click="logout")
      font-awesome-icon(icon="sign-out" fixed-width style="margin-right: 4px;")
      span(v-t="'signout_btn'")
</template>

<script>
import { mapState } from 'vuex'
import PlayerInfoAvatar from '@/components/player/PlayerInfoAvatar'
import gql from 'graphql-tag'

export default {
  name: 'NavCard',
  components: { PlayerInfoAvatar },
  computed: {
    ...mapState(['header', 'user']),
    roleIcon() {
      return {
        moderator: 'user-tie',
        admin: 'user-cog'
      }[this.user.role]
    }
  },
  apollo: {
    profile: {
      query: gql`query FetchNavCard($id: ID!) {
        profile(id: $id) {
          id
          exp {
            totalExp
            currentLevelExp
            nextLevelExp
            currentLevel
          }
          rating
          header {
            thumbnail
          }
          user {
            id
            avatar {
              original
            }
          }
        }
      }`,
      variables() {
        return {
          id: this.$store.state.user.id
        }
      }
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

<style lang="scss">
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
    text-shadow: $text-ele;
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
      color: $theme5;
      transition: 0.4s $hoverEasing;
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
        &:before {
          background: -webkit-gradient(linear, left top, left bottom, from(#f00), to(#333));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: initial; /* reset Font Awesome's display:inline-block */
        }
      }
      .navcard-title {
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
    transition: 0.2s $hoverEasing;
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
