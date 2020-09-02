<template lang="pug">
.has-text-centered
  template(v-if="sent")
    h4.is-size-4.has-text-centered  Sent
    h1.is-size-1.has-text-centered: font-awesome-icon(icon="paper-plane")
    p Please check your inbox to continue
    captcha(ref="captcha")
    b-button(@click="resend" :loading="loading" :disabled="time>0 || !captchaCode" expanded)
      | Resend
      span(v-if="time>0") ({{time}})
  template(v-else)
    h4.is-size-4.has-text-centered Reset your password
    h1.has-text-centered.is-size-1 🤔
    p Enter your email address and we will send you a link to reset your password.
    ValidationObserver(v-slot="{ invalid, handleSubmit }" ref="validator" slim): form(@submit.prevent="handleSubmit(submit)")
      ValidationProvider(slim
        rules="required|email"
        v-slot="{ errors, valid }"
        name="Email"
        vid="email")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="email" icon="envelope")
      captcha(ref="captcha")
      b-button(native-type="submit" expanded :loading="loading") Send
</template>

<script>
import gql from 'graphql-tag'
import Captcha from '@/components/Captcha'
export default {
  name: 'Reset',
  components: {
    Captcha,
  },
  data () {
    return {
      sent: null,
      time: 60,
      loading: false,
      email: null,
    }
  },
  methods: {
    submit () {
      const email = this.email
      this.loading = true
      this.$refs.captcha.execute()
        .then((token) => {
          return this.$apollo.mutate({
            mutation: gql`mutation SendPasswordResetEmail($email: String!){
              sendResetPasswordEmail(email: $email)
          }`,
            variables: {
              email,
              captcha: token
            }
          })
        })
        .then((result) => {
          const success = result.data.sendResetPasswordEmail
          if (!success) {
            this.$buefy.toast.open({
              message: 'The email was never registered / confirmed!',
              type: 'is-danger',
            })
          } else {
            this.sent = email
            this.startTimer()
          }
        })
        .catch(error => this.handleErrorToast(error))
        .then(() => {
          this.captchaCode = null
          this.loading = false
        })
    },
    resend () {
      this.loading = true
      setTimeout(() => { this.loading = false }, 1000)
      this.$apollo.mutate({
        mutation: gql`mutation SendPasswordResetEmail($email: String!){
              sendResetPasswordEmail(email: $email)
          }`,
        variables: {
          email: this.sent,
          captcha: this.captchaCode
        }
      })
        .then(() => {
          this.loading = false
          this.startTimer()
        })
        .catch(error => this.handleErrorToast(error))
        .then(() => {
          this.captchaCode = null
          this.loading = false
        })
    },
    startTimer () {
      this.time = 60
      const timer = setInterval(() => {
        this.time -= 1
        if (this.time <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }
  },
  head () {
    return {
      title: 'Reset Password - Cytoid'
    }
  }
}
</script>
