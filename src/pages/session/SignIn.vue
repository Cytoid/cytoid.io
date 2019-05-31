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
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
          >
            Sign in
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-divider />
    <div>
      <h2>New to Cytoid?</h2>
      <p>Sign up to access all Cytoid multiplayer features. It takes less than 30 seconds!</p>
      <nuxt-link to="./signup">
        <a-button
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
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    signIn() {
      this.form.validateFields(async (err, values) => {
        if (err) {
          return
        }
        this.loading = true
        const token = await this.$captcha('login')
        this.$auth.loginWith('local', {
          data: { ...values, token },
        })
          .then((response) => {
            this.loading = false
            this.$message.info('signed in')
          })
          .catch((error) => {
            this.loading = false
            console.log(error)
            this.$message.error('Error!')
          })
      })
    },
  },
}
</script>
