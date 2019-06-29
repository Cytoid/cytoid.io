<template>
  <div>
    <nuxt-link to="./login">
      <a-button type="primary" shape="circle" icon="left" size="large" />
    </nuxt-link>
    <h2 style="margin-top: 1rem;">
      Sign up
    </h2>
    <a-form
      :form="form"
      @submit.prevent="signUp"
    >
      <a-form-item>
        <div slot="extra">
          Your player ID must be in between 3 and 16 characters and contain only <b>lowercase letters</b>, numbers,
          underscores, and hyphens.
        </div>
        <a-input
          v-decorator="[
            'uid',
            { rules: [{
              required: true,
              pattern: '^[a-z0-9_-]{3,16}$',
              message: '3-16 lowercase letters, numbers, _ or -',
            }] }
          ]"
          placeholder="Player ID"
        >
          <font-awesome-icon slot="prefix" icon="user" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            { rules: [
              { required: true, message: 'An email address is required.' },
              { type: 'email', message: 'The input is not a valid email' },
            ] }
          ]"
          html-type="email"
          placeholder="Email address"
        >
          <font-awesome-icon slot="prefix" icon="envelope" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [
              { required: true, message: 'Please input a password.' },
              { min: 8, message: 'Password has to contain at least 8 characters.'},
            ] }
          ]"
          type="password"
          placeholder="Password"
        >
          <font-awesome-icon slot="prefix" icon="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-checkbox
          v-decorator="[
            'agree_tos',
            {
              valuePropName: 'checked',
              initialValue: false,
              rules: [{
                required: true,
                transform: value => (value || undefined),
                type: 'boolean',
                message: 'You must agree to our terms of services.'
              }],
            }
          ]"
        >
          I agree to Cytoid's <a href="">terms of services.</a>
        </a-checkbox>
      </a-form-item>
      <captcha theme="dark" :token.sync="captchaToken" />
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          block
          :loading="loading"
          :disabled="!captchaToken"
        >
          Join the community
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      captchaToken: null,
      loading: false,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    signUp() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$axios.post('/users', { ...values, token: this.captchaToken })
          .then((res) => {
            this.loading = false
            this.$message.info('Registration succeed')
            this.$router.push({ name: 'session-login' })
          })
          .catch((error) => {
            this.$message.error(error.response?.data?.message || error.message)
            this.loading = false
            this.$captcha.reset()
            this.captchaToken = null
          })
      })
    },
  },
}
</script>
