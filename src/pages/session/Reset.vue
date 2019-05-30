<template lang="pug">
.section.has-text-centered(v-if="sent")
  h2 Sent
  h1: font-awesome-icon(icon="paper-plane")
  p Please check your inbox to continue
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
    a-button(type="primary" html-type="submit" block) Send
</template>

<script>
export default {
  name: 'Reset',
  data() {
    return {
      sent: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    submit() {
      this.sent = true
    }
  }
}
</script>
