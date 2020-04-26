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
          b-input(v-model="form.uid" icon="user" :placeholder="$t('id_placeholder')")
      ValidationProvider(
        slim
        rules="password|required"
        v-slot="{ errors, valid }"
        :name="$t('email_field_label')"
        vid="password")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.password" icon="lock" type="password" :placeholder="$t('email_placeholder')")
      ValidationProvider(
        slim
        v-if="createNew"
        rules="password_confirm:@password|required"
        v-slot="{ errors, valid }"
        :name="$t('email_field_label')"
        vid="confirm")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          p.help The player ID you specified does not exist. Repeat the password, and we shall create a new account for you.
          b-input(v-model="form.confirm" type="password" icon="lock" :placeholder="$t('password_confirm_field_placeholder')")
      b-button(native-type="submit" :loading="loading" :disabled="!captchaToken || invalid")
</template>

<script>
export default {
  name: 'ExternalAccountLink',
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
          await this.$axios.post(`/users/${user.id}/providers/${this.provider}`, {
            token: this.$route.query.token
          })
          return user
        })
        .then((user) => {
          this.loading = false
          this.$message.info('Welcome, ' + (user.uid))
          this.$router.go(-1)
          global.window.gtag('event', 'login', {
            event_category: 'auth',
            value: user.uid || 'nouid'
          })
        })
        .catch((error) => {
          this.loading = false
          if (error.response && error.response.status === 401) {
            this.$message.error('Username or password mismatch!')
            this.form.resetFields(['password'])
            // this.$captcha.reset()
            this.captchaToken = null
          } else if (error.response && error.response.status === 404) {
            this.createNew = true
          } else {
            this.handleErrorToast(error)
          }
        })
    },
    create() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$axios.put('/users/', {
          token: this.$route.query.token,
          provider: this.provider,
          uid: values.username,
          password: values.password,
        })
          .then((res) => {
            const user = res.data.user
            this.loading = false
            this.$message.info('Welcome, ' + (user.uid))
            this.$router.go(-1)
            this.$store.commit('setUser', user)
            global.window.gtag('event', 'signup', {
              event_category: 'auth',
              value: values.uid
            })
          })
          .catch((error) => {
            this.loading = false
            this.handleErrorToast(error)
          })
      })
    },
  },
  i18n: {
    key: 'signup'
  }
}
</script>
