<template lang="pug">
  div
    .section(v-if="membership"): .columns
      .column.is-half.has-text-centered.is-offset-one-quarter
        .heading(v-t="'sponsorship'")
        .title(v-t="'sponsor_name'")
        .crowned-avatar
          font-awesome-icon.crown-icon(:icon="['fad', 'crown']" size="4x")
          avatar(:source="$store.getters.avatarURL()" fixed :size="128")
        form(@submit.prevent)
          b-field
            template(slot="label")
              span(v-t="'sponsorship_quote'")
              a(@click="showQuoteQuestionMark")
                font-awesome-icon(icon="question-circle" style="margin-left: 0.25rem;")
            .control: input.input.has-text-centered(type="text" v-model="quote")
          b-button(native-type="submit" size="is-small" @click="updateQuote" :loading="loading==='quote'" v-t="'save_btn'")
    .columns
      .column
        .box.patreon.is-gradient
          img(:src="require('@/assets/images/patreon.png')" style="width: 150px; display: block; margin-bottom: 1rem;")
          p(v-if="!externals.includes('patreon')" v-t="'patreon_link_prompt'")
          p(v-else v-t="'patreon_linked_prompt'")
          .has-text-centered(style="margin-top: 1rem;")
            b-button(
              @click="link('patreon')"
              :disabled="externals.includes('patreon')"
              :loading="loading==='patreon'").is-fullwidth
              b-icon(icon="patreon" pack="fab")
              span(v-t="'link_btn'")
            b-button.is-fullwidth(
              style="margin-top: 1rem;"
              @click="syncMembershipStatus('patreon')"
              :loading="loading==='patreon'"
              v-if="externals.includes('patreon')")
              font-awesome-icon(icon="sync" style="margin-right: 0.5rem;")
              span(v-t="'sync_btn'")
      .column
        .box.afdian.is-gradient
          img(:src="require('@/assets/images/afdian.png')" style="width: 110px; display: block; margin-bottom: 1rem;")
          p(v-if="!externals.includes('afdian')" v-t="'afdian_link_prompt'")
          p(v-else v-t="'afdian_linked_prompt'")
          form(style="padding: 2rem 0 1rem" @submit.prevent="afdianLogin" v-if="!externals.includes('afdian')")
            b-field(:label="$t('afdian_login_username')")
              b-input(v-model="afdian.username")
            b-field(:label="$t('afdian_login_password')" :message="$t('afdian_login_hint')")
              b-input(type="password" v-model="afdian.password")
            b-button.is-pulled-right(native-type="submit" :loading="loading === 'afdian'")
              span(v-t="'link_btn'")
            .is-clearfix
          b-button.is-fullwidth(style="margin-top: 1rem;" @click="syncMembershipStatus('afdian')" v-else :loading="loading==='afdian'")
            font-awesome-icon(icon="sync" style="margin-right: 0.5rem;")
            span(v-t="'sync_btn'")
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
        externals,
        quote: membership.quote,
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
    updateQuote () {
      this.loading = 'quote'
      this.$axios
        .post('/membership', { quote: this.quote })
        .then(() => {
          this.$buefy.toast.open({
            message: this.$t('quote_updated'),
            type: 'is-success'
          })
        })
        .catch(err => this.handleErrorToast(err))
        .finally(() => {
          this.loading = null
        })
    },
    afdianLogin () {
      this.loading = 'afdian'
      this.$axios.post('/session/external/afdian', this.afdian)
        .then((res) => {
          this.$buefy.toast.open({
            message: this.$t('afdian_login_success_prompt'),
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
            return this.syncMembershipStatus('patreon')
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
        message: this.$t('quote_question_mark_button'),
      })
    }
  },
  i18n: {
    key: 'settings'
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
.quote-input input {
  text-align: center;
}
</style>
