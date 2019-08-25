<template lang="pug">
  .section(v-if="state === 0")
    h2.has-text-centered Reset your password
    h1.has-text-centered: font-awesome-icon(icon="file-archive")
    a-form(:form="form" @submit.prevent="submit")
      a-form-item
        a-input(
          v-decorator="['password',{ rules: [{ required: true, message: 'Please input a password.' }, { min: 8, message: 'Password has to be at least 8 characters.'}]}]"
          type="password"
          placeholder="Password"
        )
      a-form-item
        a-input(
          v-decorator="['passwordComfirm',{ rules: [{ validator: comparePasswords }]}]"
          type="password"
          placeholder="Password Confirm"
        )
      a-button(type="primary" html-type="submit" block :loading="loading") Submit
      captcha(theme="dark" invisible badge="bottomright")
  .section(v-else-if="state === 1")
    h2.has-text-centered Success!
    h1.has-text-centered: font-awesome-icon(icon="check-circle")
    nuxt-link(to="/session/login")
      a-button(type="primary" block) Log In
  .section(v-else)
    h2.has-text-centered Oops...
    h1.has-text-centered: font-awesome-icon(icon="exclamation-triangle")
    p This is a bit awkward, but the link expired.
    nuxt-link(to="/session/reset")
      a-button(type="primary" block) Try Again
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      state: 0, // 0 - nature, -1 - wrong token, 1 - success
    }
  },
  head() {
    return {
      title: 'Confirm - Reset Password - Cytoid'
    }
  },
  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const password = values.password
        this.loading = true
        setTimeout(() => { this.loading = false }, 1000)
        this.$captcha('reset_password_continue')
          .then(token => this.$axios.post('/session/reset/' + this.$route.params.token, { password, token }))
          .then(() => {
            this.state = 1
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              console.log('wrong code!')
              this.state = -1
            } else {
              this.handleErrorToast(error)
            }
          })
          .then(() => {
            this.loading = false
          })
      })
    },
    comparePasswords(rule, value, cdb) {
      if (value && value !== this.form.getFieldValue('password')) {
        cdb('Passwords inconsistent!')
      } else {
        cdb()
      }
    },
  },
}
</script>
