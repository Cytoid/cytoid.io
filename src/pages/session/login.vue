<template>
  <div>
    <div>
      <h2>Already have a Cytoid account?</h2>
      <p>Please sign in below.</p>
      <a-form
        :form="form"
        @submit.prevent="signIn"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              { rules: [{ required: true, message: 'Please input your player ID or email address.' }] }
            ]"
            placeholder="Player ID / Email address"
          >
            <font-awesome-icon slot="prefix" icon="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: 'Please input your password.' }] }
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
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              }
            ]"
          >
            Remember me
          </a-checkbox>
          <nuxt-link to="/session/reset" class="is-pulled-right">
            Forgot password
          </nuxt-link>
        </a-form-item>
        <captcha theme="dark" :token.sync="captchaToken" style="margin-bottom: 1rem;" />
        <a-button
          class="card-button"
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="!captchaToken"
          block
        >
          Sign in
        </a-button>
      </a-form>
    </div>
    <a-divider />
    <div>
      <h2>New to Cytoid?</h2>
      <p>Sign up to access all Cytoid multiplayer features. It takes less than 30 seconds!</p>
      <nuxt-link to="./signup">
        <a-button
          class="card-button"
          type="primary"
          html-type="submit"
          block
        >
          Sign up
        </a-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      captchaToken: null,
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    signIn() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$store.dispatch('login', { ...values, token: this.captchaToken })
          .then((user) => {
            this.loading = false
            this.$message.info('Welcome, ' + (user.name || user.uid))
            this.$router.replace('/')
            global.window.gtag('event', 'login', {
              event_category: 'auth',
              value: user.uid || 'nouid'
            })
          })
          .catch((error) => {
            this.loading = false
            this.$captcha.reset()
            this.captchaToken = null
            this.form.resetFields(['password'])
            if (error.response && error.response.status === 401) {
              this.$message.error('Username/password mismatch!')
            } else {
              this.handleErrorToast(error)
            }
          })
      })
    },
  },
}
</script>
