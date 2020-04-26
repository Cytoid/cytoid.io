<template lang="pug">
div
  .section
    .card-pre-header
      p(v-t="'password_field_label'")
    .box
      ValidationObserver(v-slot="{ invalid, handleSubmit }" ref="validator" slim): form(@submit.prevent="handleSubmit(submit)")
        ValidationProvider(slim
        rules="required"
          v-slot="{ errors, valid }"
          :name="$t('password_field_label')"
          vid="old")
          b-field(
            horizontal
            :label="$t('password_field_label')"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors")
            b-input(v-model="form.old" type="password")
        ValidationProvider(slim
        rules="password|required"
          v-slot="{ errors, valid }"
          :name="$t('new_password_field_label')"
          vid="new")
          b-field(
            horizontal
            :label="$t('new_password_field_label')"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors")
            b-input(v-model="form.new" type="password")
        ValidationProvider(slim
        rules="required|password_confirm:@new"
          v-slot="{ errors, valid }"
          :name="$t('password_confirm_field_label')"
          vid="confirm")
          b-field(
            horizontal
            :label="$t('password_confirm_field_label')"
            :type="{ 'is-danger': errors[0], 'is-success': valid }"
            :message="errors")
            b-input(v-model="form.confirm" type="password")
        b-button.is-pulled-right(native-type="submit" :loading="loading") {{$t('submit_btn')}}
        .is-clearfix
  .section
    .card-pre-header
      p(v-t="'third_party_sign_on'")
    .box
      .media.external-login(v-for="provider in providers" :key="provider.id")
        .media-content
          font-awesome-icon(:icon="['fab', provider.icon || provider.id]" size="2x" fixed-width)
          .content
            h3(v-text="provider.title")
            small(v-if="externals.includes(provider.id)") Connected
            small(v-else) Not Connected
        .media-right
          b-button(v-if="externals.includes(provider.id)" @click="unlink(provider.id)" :loading="providersLoading === provider.id") Unlink
          b-button(v-else @click="link(provider.id)" :loading="providersLoading === provider.id") Link
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'Security',
  data() {
    return {
      form: {
        old: '',
        new: '',
        confirm: '',
      },
      loading: false,
      externals: [],
      providers: [
        { id: 'facebook', icon: 'facebook-f', title: 'Facebook' },
        { id: 'google', title: 'Google' },
        { id: 'discord', title: 'Discord' }
      ],
      providersLoading: null,
    }
  },
  asyncData({ $axios, store, app }) {
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
  methods: {
    submit() {
      this.loading = true
      this.$apollo.mutate({
        mutation: gql`mutation ChangePassword($old: String!, $new: String!) {
          result: changePassword(oldPassword: $old, newPassword: $new)
        }`,
        variables: {
          old: this.form.old,
          new: this.form.new
        }
      })
        .then((result) => {
          if (result?.data?.result) {
            this.$buefy.toast.open({
              message: 'Password Changed Successfully!',
              position: 'is-top',
              type: 'is-success'
            })
            this.form.old = ''
            this.form.new = ''
            this.form.confirm = ''
            requestAnimationFrame(() => this.$refs.validator.reset())
          } else {
            this.$refs.validator.setErrors({
              old: ['The old password is incorrect']
            })
          }
        })
        .catch(this.handleErrorToast)
        .then(() => {
          this.loading = false
        })
    },
    link(provider) {
      this.providersLoading = provider
      window.open(process.env.apiURL + '/session/external/' + provider)
      window.addEventListener('message', this.providerResponded)
    },
    providerResponded(event) {
      window.removeEventListener('message', this.providerResponded)
      /*
      if (process.event.origin !== process.env.apiURL) {
        return
      }
      */
      if (event.data.user) {
        this.providersLoading = null
        const user = event.data.user
        this.$store.commit('setUser', user)
        this.$message.info(`You're now logged in as ${user.name || user.uid}.`)
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
            this.providersLoading = null
            this.externals.push(event.data.provider)
            this.$buefy.toast.open({
              message: `You have linked your ${event.data.provider} account`,
            })
          })
      }
    },
    unlink(provider) {
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
  },
  i18n: {
    key: 'settings'
  }
}
</script>

<style lang="scss">
.media.external-login {
  .media-content {
    display: flex;
    flex-direction: row;
    .content {
      margin-left: 1rem;
      line-height: 1;
      h3 {
        margin-bottom: 0.25rem;
      }
    }
  }
}
</style>
