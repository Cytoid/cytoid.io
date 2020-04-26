<template lang="pug">
  div
    h2(v-t="{ path: 'link_title', args: { provider } }")
    p(v-t="'link_subtitle'")
    ValidationObserver(v-slot="{ invalid, handleSubmit }" ref="validator" slim): form(@submit.prevent="handleSubmit(createNew ? create : link)")
      ValidationProvider(
        slim
        rules="uid|required"
        v-slot="{ errors, valid }"
        :name="$t('username_field_label')"
        vid="uid")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.username" icon="user" :placeholder="$t('id_placeholder')")
      ValidationProvider(
        slim
        rules="required"
        v-slot="{ errors, valid }"
        :name="$t('password_field_label')"
        vid="password")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(
            v-model="form.password"
            icon="lock"
            type="password"
            :placeholder="$t('password_field_placeholder')"
            ref="passwordField")
      captcha.has-text-centered(v-model="captchaToken" size="compact" style="margin-top: 1rem; ")
      b-button(
        native-type="submit"
        :loading="loading"
        :disabled="!captchaToken || invalid" expanded
      ) {{ $t('login_btn') }}
</template>

<script>
import Captcha from '@/components/Captcha'
import gql from 'graphql-tag'
export default {
  name: 'ExternalAccountLink',
  components: {
    Captcha,
  },
  data() {
    return {
      form: {
        username: null,
        password: null,
        confirm: null,
      },
      createNew: false,
      captchaToken: null,
      loading: false,
    }
  },
  head() {
    return {
      title: 'Link - Cytoid'
    }
  },
  computed: {
    provider() {
      return this.$route.query.provider
    }
  },
  methods: {
    link() {
      this.loading = true
      this.$store.dispatch('login', {
        username: this.form.username,
        password: this.form.password,
        captcha: this.captchaToken,
      })
        .then(async (user) => {
          await this.$apollo.mutate({
            mutation: gql`mutation LinkExternalAccount($token: String!) {
             result: addExternalAccount(token: $token)
            }`,
            variables: {
              token: this.$route.query.token
            }
          })
          return user
        })
        .then((user) => {
          this.loading = false
          this.$message.info(this.$t('login_snack_bar', { name: user.name || user.uid }))
          if (this.$route.query.origin) {
            this.$router.replace(this.$route.query.origin)
          } else {
            this.$router.replace({ name: 'settings-account' })
          }
          global.window.gtag('event', 'login', {
            event_category: 'auth',
            value: user.uid || 'nouid'
          })
        })
        .catch((error) => {
          this.loading = false
          if (error.response && error.response.status === 401) {
            // Wrong password
            this.$buefy.toast.open({
              message: this.$t('login_password_error'),
              type: 'is-danger'
            })
            this.form.password = null
            this.captchaToken = null
            this.$refs.passwordField.$el.focus()
          } else if (error.response && error.response.status === 404) {
            // Account does not exist.
            this.$router.replace({
              name: 'session-signup',
              query: {
                token: this.$route.query.token,
                provider: this.$route.query.provider,
                username: this.form.username,
                origin: this.$route.query.origin,
              }
            })
          } else {
            this.handleErrorToast(error)
          }
        })
    },
  },
  i18n: {
    key: 'signup'
  }
}
</script>
