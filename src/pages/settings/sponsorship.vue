<template lang="pug">
  div
    .box.patreon.is-gradient(v-if="!externals.includes('patreon')")
      img(:src="require('@/assets/images/patreon.png')" style="width: 150px; display: block; margin-bottom: 1rem;")
      p Link your Patreon account to claim your deserved membership benefits!
      .has-text-centered(style="margin-top: 1rem;")
        b-button(@click="link('patreon')")
          b-icon(icon="patreon" pack="fab")
          | Link Patreon
    .box.afdian.is-gradient(v-if="!externals.includes('afdian')")
      img(:src="require('@/assets/images/afdian.png')" style="width: 110px; display: block; margin-bottom: 1rem;")
      p Link your 爱发电 account to claim your deserved membership benefits!
      form(style="padding: 2rem 0 1rem" @submit.prevent="afdianLogin")
        b-field(label="爱发电用户名" horizontal)
          b-input(v-model="afdian.username")
        b-field(label="爱发电密码" horizontal message="您的登陆信息将仅用于验证您的身份。我们不会保存您的密码。")
          b-input(type="password" v-model="afdian.password")
        b-button.is-pulled-right(native-type="submit" :loading="afdianLoading") 连接
        .is-clearfix
    .buttons.is-pulled-right
      b-button(type="is-danger" v-if="externals.includes('afdian')" @click="unlink('afdian')") Unlink 爱发电
      b-button(type="is-danger" v-if="externals.includes('patreon')" @click="unlink('patreon')") Unlink Patreon
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
      patreonLoading: null,
    }
  },
  methods: {
    afdianLogin () {
      this.afdianLoading = true
      this.$axios.post('/session/external/afdian', this.afdian)
        .then((res) => {
          this.$buefy.toast.open({
            message: `你已经成功链接爱发电账户 ${res.data?.name}！`,
            type: 'is-success'
          })
          this.externals.push('afdian')
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.afdianLoading = false
        })
    },
    providerResponded (event) {
      window.removeEventListener('message', this.providerResponded)
      /*
      if (process.event.origin !== process.env.apiURL) {
        return
      }
      */
      if (event.data.user) {
        this.patreonLoading = null
        const user = event.data.user
        this.$store.commit('setUser', user)
        this.$buefy.toast.open({
          message: `You're now logged in as ${user.name || user.uid}.`,
          type: 'is-info'
        })
      } else if (event.data.token && event.data.provider) {
        this.$apollo.mutate({
          mutation: gql`mutation LinkExternalAccount($token: String!) {
             result: addExternalAccount(token: $token)
            }`,
          variables: {
            token: event.data.token
          }
        })
          .then(() => {
            this.externals.push(event.data.provider)
            this.$buefy.toast.open({
              message: `You have linked your ${event.data.provider} account`,
              type: 'is-success'
            })
          })
          .catch(err => this.handleErrorToast(err))
          .finally(() => {
            this.patreonLoading = null
          })
      } else {
        this.patreonLoading = null
        this.$buefy.toast.open({
          message: 'Incomplete information returned from OAuth service',
          type: 'is-danger'
        })
      }
    },
    link (provider) {
      this.providersLoading = provider
      window.open(process.env.apiURL + '/session/external/' + provider)
      window.addEventListener('message', this.providerResponded)
    },
    unlink (provider) {
      this.providersLoading = provider
      return this.$apollo.mutate({
        mutation: gql`mutation RemoveExternalAccount($provider: String!) {
          result: removeExternalAccount(provider: $provider)
        }`,
        variables: {
          provider,
        }
      })
        .then((data) => {
          this.providersLoading = null
          this.externals.splice(this.externals.indexOf(provider), 1)
          this.$buefy.toast.open({
            message: `You have unlinked your ${provider} account`,
            type: 'is-warning'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  &.patron {
    --box-background-gradient: linear-gradient(to right bottom, #F96854, #F96854);
  }
  &.afdian {
    --box-background-gradient: linear-gradient(to right bottom, hsla(260, 71%, 66%, 1), hsla(260, 71%, 66%, 1));
  }
}
</style>
