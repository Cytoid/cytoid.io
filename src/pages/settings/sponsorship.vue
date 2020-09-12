<template lang="pug">
  div
    .box
      img(:src="require('@/assets/images/patreon.png')" style="width: 150px; display: block; margin-bottom: 1rem;")
      span This Cytoid ID is linked to #[b adldl]
      .level(style="padding: 2rem 0 1rem")
        .level-item.has-text-centered: div
          p.heading Membership Tier
          p.title Coffee Contributor
        .level-item.has-text-centered: div
          p.heading Monthly contribution
          p.title $5
        .level-item.has-text-centered: div
          p.heading Has been a member for
          p.title 5 years
    .box.is-sponsored.afdian.is-gradient(v-if="externals.includes('afdian')")
      img(:src="require('@/assets/images/afdian.png')" style="width: 110px; display: block; margin-bottom: 1rem;")
      .level(style="padding: 2rem 0 1rem")
        .level-item.has-text-centered: div
          p.heading Membership Tier
          p.title Coffee Contributor
        .level-item.has-text-centered: div
          p.heading Monthly contribution
          p.title $5
        .level-item.has-text-centered: div
          p.heading Has been a member for
          p.title 5 years
      hr
      .buttons
        b-button Adjust Membership
        b-button Unlink
    .box.afdian(v-else)
      img(:src="require('@/assets/images/afdian.png')" style="width: 110px; display: block; margin-bottom: 1rem;")
      p Link your 爱发电 account to claim your deserved membership benefits!
      form(style="padding: 2rem 0 1rem" @submit.prevent="afdianLogin")
        b-field(label="爱发电用户名" horizontal)
          b-input(v-model="afdian.username")
        b-field(label="爱发电密码" horizontal message="您的登陆信息将仅用于验证您的身份。我们不会保存您的密码。")
          b-input(type="password" v-model="afdian.password")
        b-button.is-pulled-right(native-type="submit" :loading="afdianLoading") 连接
        .is-clearfix
</template>

<script>
import gql from 'graphql-tag'
export default {
  asyncData ({ $axios, store, app }) {
    return app.apolloProvider.defaultClient.query({
      query: gql`query GetUserSecuritySettings {
        my {
          externals: externalAccountProviders
        }
      }`
    })
      .then(response => ({
        externals: response.data?.my?.externals || []
      }))
  },
  data () {
    return {
      afdian: {
        username: '',
        password: '',
      },
      afdianLoading: false,
      externals: [],
    }
  },
  methods: {
    afdianLogin () {
      this.afdianLoading = true
      this.$axios.post('/session/external/afdian', this.afdian)
        .then((user) => {
          console.log(user)
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.afdianLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.box.is-sponsored {
  &.patron {
    --box-background-gradient: linear-gradient(to right bottom, #F96854, #F96854);
  }
  &.afdian {
    --box-background-gradient: linear-gradient(to right bottom, hsla(260, 71%, 66%, 1), hsla(260, 71%, 66%, 1));
  }
}
</style>
