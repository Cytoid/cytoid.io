<template lang="pug">
  div
    div
      h4.is-size-4(v-t="'title'")
      p(v-t="'subtitle'" style="margin-bottom: 1rem;")
      form(@submit.prevent="signIn")
        b-field
          b-input(v-model="form.username" :placeholder="$t('username_field_placeholder')" icon="user")
        b-field
          b-input(v-model="form.password" type="password" :placeholder="$t('password_field_placeholder')" icon="lock")
        b-checkbox(v-model="form.remember") {{$t('remember_me_checkbox_title')}}
        nuxt-link.is-pulled-right(to="/session/reset")
          small(v-t="'forgot_password_link_title'")
        captcha(ref="captcha")
        b-button(
          native-type="submit"
          :loading="loading"
          expanded
          style="margin-top: 1rem;") {{ $t('login_btn') }}
    .level.is-mobile(style="margin-top: 1rem; margin-bottom: 1rem;")
      font-awesome-icon.level-item(v-if="externalLoginLoading" icon="spinner" spin)
      template(v-else)
        a.level-item(@click="signInWithProvider('facebook')")
          font-awesome-icon(:icon="['fab', 'facebook-f']")
        a.level-item(@click="signInWithProvider('google')")
          font-awesome-icon(:icon="['fab', 'google']")
        a.level-item(@click="signInWithProvider('discord')")
          font-awesome-icon(:icon="['fab', 'discord']")
    .divider OR
    .content
      h4.is-size-4(v-t="'new_user_welcome_title'")
      p(v-t="'new_user_welcome_content'" style="margin-bottom: 1rem;")
      nuxt-link.button.is-fullwidth(
        :to="{ name: 'session-signup', query: { origin: $route.query.origin} }"
        replace) {{$t('signup_btn')}}
</template>

<script>
import Captcha from '@/components/Captcha'
export default {
  components: {
    Captcha,
  },
  data () {
    return {
      loading: false,
      externalLoginLoading: false,
      form: {
        username: null,
        password: null,
        remember: true,
      }
    }
  },
  methods: {
    signInWithProvider (provider) {
      this.externalLoginLoading = true
      window.addEventListener('message', this.providerResponded)
      window.open(process.env.apiURL + '/session/external/' + provider)
    },
    providerResponded (event) {
      window.removeEventListener('message', this.providerResponded)
      console.log(event.data)
      console.log(event.origin)
      /*
      if (process.event.origin !== process.env.apiURL) {
        return
      }
      */
      this.externalLoginLoading = false
      if (event.data.user) {
        const user = event.data.user
        this.$store.commit('setUser', user)
        this.$buefy.toast.open({
          message: this.$t('login_snack_bar', { name: user.name || user.uid }),
          type: 'is-info',
        })
        if (this.$route.query.origin) {
          this.$router.replace(this.$route.query.origin)
        } else {
          this.$router.replace({ name: 'settings-account' })
        }
      } else if (event.data.token && event.data.provider) {
        this.$router.replace({
          name: 'session-link',
          query: {
            token: event.data.token,
            provider: event.data.provider,
            origin: this.$route.query.origin || null,
          },
        })
      }
    },
    signIn () {
      this.loading = true
      this.$refs.captcha.execute()
        .then(token => this.$store.dispatch('login', { ...this.form, captcha: token }))
        .then((user) => {
          this.$buefy.toast.open({
            message: this.$t('login_snack_bar', { name: user.name || user.uid }),
            type: 'is-info',
          })
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
          if (error.response && error.response.status === 401) {
            this.$buefy.toast.open({
              message: this.$t('login_password_error'),
              type: 'is-danger'
            })
          } else if (error.response && error.response.status === 404) {
            this.$buefy.toast.open({
              message: this.$t('login_username_error'),
              type: 'is-danger'
            })
          } else if (error.response && error.response.status === 403) {
            this.$buefy.toast.open({
              message: this.$t('login_inactive_error'),
              type: 'is-warning'
            })
          } else {
            this.handleErrorToast(error)
          }
        })
        .then(() => {
          this.loading = false
          this.captchaToken = null
        })
    },
  },
  head () {
    return {
      title: 'Login - Cytoid'
    }
  },
  i18n: {
    key: 'login'
  }
}
</script>
