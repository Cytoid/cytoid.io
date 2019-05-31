<template lang="pug">
.section.has-text-centered(v-if="sent")
  h2 Sent
  h1: font-awesome-icon(icon="paper-plane")
  p Please check your inbox to continue
  a-button(@click="resend" :loading="loading" :disabled="time>0" block)
    | Resend
    span(v-if="time>0") ({{time}})
.section(v-else)
  h2.has-text-centered Reset your password
  h1.has-text-centered 🤔
  p Enter your email address and we will send you a link to reset your password.
  a-form(:form="form" @submit.prevent="submit")
    a-form-item
      a-input(
        v-decorator="['email', {rules: [{type: 'email', message: 'The input is not a valid email'}, {required: true, message: 'please input your email address!'}]}]"
      )
        font-awesome-icon(icon="envelope" slot="prefix")
    a-button(type="primary" html-type="submit" block :loading="loading") Send
</template>

<script>
export default {
  name: 'Reset',
  data() {
    return {
      sent: null,
      time: 60,
      loading: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    submit() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const email = values.email
        this.loading = true
        this.$captcha('reset_password')
          .then(token => this.$axios.post('/session/reset', { email, token }))
          .then(() => {
            this.sent = email
            this.startTimer()
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              this.form.setFields({
                email: { errors: [{ message: 'The email was never registered / confirmed!' }] }
              })
            } else {
              this.$message.error((error.response && error.response.data) || error.message)
            }
          })
          .then(() => {
            this.loading = false
          })
      })
    },
    resend() {
      this.loading = true
      this.$captcha('reset_password')
        .then(token => this.$axios.post('/session/reset', { email: this.sent, token }))
        .then(() => {
          this.loading = false
          this.startTimer()
        })
        .catch((error) => {
          this.$message.error((error.response && error.response.data) || error.message)
        })
        .then(() => {
          this.loading = false
        })
    },
    startTimer() {
      this.time = 60
      const timer = setInterval(() => {
        this.time -= 1
        if (this.time <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>
