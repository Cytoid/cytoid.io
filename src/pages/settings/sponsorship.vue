<template lang="pug">
  div
    .section(v-if="membership"): .columns
      .column.is-half.has-text-centered.is-offset-one-quarter
        .heading Membership Tier
        .title Coffee Contributor
        .crowned-avatar
          font-awesome-icon.crown-icon(:icon="['fad', 'crown']" size="4x")
          avatar(:source="$store.getters.avatarURL()" fixed :size="128")
        form(@submit.prevent)
          b-field
            template(slot="label")
              | Quote
              a(@click="showQuoteQuestionMark")
                font-awesome-icon(icon="question-circle" style="margin-left: 0.25rem;")
            b-input.has-text-centered
          b-button(native-type="submit" size="is-small") Save
    .columns
      .column
        .box.patreon.is-gradient
          img(:src="require('@/assets/images/patreon.png')" style="width: 150px; display: block; margin-bottom: 1rem;")
          p(v-if="!externals.includes('patreon')") Link your Patreon account to claim your deserved membership benefits!
          p(v-else) You have linked your Patreon account
          .has-text-centered(style="margin-top: 1rem;")
            b-button(
              @click="link('patreon')"
              :disabled="externals.includes('patreon')"
              :loading="loading==='patreon'").is-fullwidth
              b-icon(icon="patreon" pack="fab")
              | Link Patreon
            b-button.is-fullwidth(
              style="margin-top: 1rem;"
              @click="syncMembershipStatus('patreon')"
              :loading="loading==='patreon'"
              v-if="externals.includes('patreon')")
              b-icon(icon="sync")
              | Sync Patreon Status
      .column
        .box.afdian.is-gradient
          img(:src="require('@/assets/images/afdian.png')" style="width: 110px; display: block; margin-bottom: 1rem;")
          p(v-if="!externals.includes('afdian')") Link your 爱发电 account to claim your deserved membership benefits!
          p(v-else) You have linked your 爱发电 account
          form(style="padding: 2rem 0 1rem" @submit.prevent="afdianLogin" v-if="!externals.includes('afdian')")
            b-field(label="爱发电用户名")
              b-input(v-model="afdian.username")
            b-field(label="爱发电密码" message="您的登陆信息将仅用于验证您的身份。我们不会保存您的密码。")
              b-input(type="password" v-model="afdian.password")
            b-button.is-pulled-right(native-type="submit" :loading="loading === 'afdian'") 连接
            .is-clearfix
          b-button.is-fullwidth(style="margin-top: 1rem;" @click="syncMembershipStatus('afdian')" v-else :loading="loading==='afdian'")
            b-icon(icon="sync")
            | Sync 爱发电 Status
</template>

<script>
import gql from 'graphql-tag'
export default {
  asyncData ({ $axios, store, app }) {
    const membershipPromise = $axios.get('/membership')
      .then(res => res.data)
    const externalsPromise = app.apolloProvider.defaultClient.query({
      query: gql`query GetUserSecuritySettings {
        my {
          externals: externalAccountProviders
        }
      }`
    })
      .then(response => (response.data?.my?.externals || []))

    return Promise.all([membershipPromise, externalsPromise])
      .then(([membership, externals]) => ({
        membership,
        externals
      }))
  },
  data () {
    return {
      quote: null,
      afdian: {
        username: '',
        password: '',
      },
      externals: [],
      loading: null,
      membership: null,
    }
  },
  methods: {
    afdianLogin () {
      this.loading = 'afdian'
      this.$axios.post('/session/external/afdian', this.afdian)
        .then((res) => {
          this.$buefy.toast.open({
            message: `你已经成功链接爱发电账户 ${res.data?.name}！`,
            type: 'is-success'
          })
          this.externals.push('afdian')
          return this.syncMembershipStatus('afdian')
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.loading = null
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
        this.loading = null
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
            this.loading = null
          })
      } else {
        this.loading = null
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
    },
    syncMembershipStatus (provider) {
      this.loading = provider
      return this.$axios
        .patch('/membership/' + provider)
        .then((res) => {
          const membership = res.data
          this.membership = membership
          return membership
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.loading = null
        })
    },
    showQuoteQuestionMark () {
      this.$buefy.dialog.alert({
        title: 'Quote',
        message: 'As a Coffee Contributor you have the privilege to tell the world why you love Cytoid! The quote is going to show up on our <b></b>',
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
.crowned-avatar {
  position: relative;
  display: inline-block;
  margin-top: 64px;
  margin-bottom: 1rem;
  .crown-icon {
    position: absolute;
    top: -50%;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    --fa-secondary-color: white;
    --fa-secondary-opacity: 1;
  }
}
</style>
