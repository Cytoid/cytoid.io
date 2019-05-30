<template>
  <div>
    <nuxt-link to="./signin">
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
              message: 'Please input a valid player ID.',
            }] }
          ]"
          placeholder="Player ID"
        >
          <a-icon
            slot="prefix"
            type="user"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            { rules: [{
              required: true,
              pattern: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: 'Please input a correct email address.'
            }] }
          ]"
          html-type="envelope"
          placeholder="Email address"
        >
          <a-icon
            slot="prefix"
            type="mail"
          />
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
          <a-icon
            slot="prefix"
            type="lock"
          />
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
                message: 'You must agree our terms of services.'
              }],
            }
          ]"
        >
          I agree to Cytoid's <a href="">terms of services.</a>
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          html-type="submit"
          block
          :loading="loading"
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
        this.$captcha('login')
          .then(token => this.$axios.post('/users', { ...values, token }))
          .then((res) => {
            this.loading = false
            this.$message.info('Registration succeed')
          })
          .catch((error) => {
            this.loading = false
            this.$message.error(error.response?.data?.message)
          })
      })
    },
  },
}
</script>
