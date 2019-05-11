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
      @submit="handleSignUp"
    >
      <a-form-item>
        <div slot="extra" style="font-size: 12px;">
          Your player ID must be in between 3 and 16 characters and contain only <b>lowercase letters</b>, numbers,
          underscores, and hyphens.
        </div>
        <a-input
          v-decorator="[
            'player_id',
            { rules: [{
              required: true,
              pattern: '^[a-z0-9_-]{3,16}$',
              message: 'Please input a correct player ID.',
            }] }
          ]"
          placeholder="Player ID"
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0,0,0,.25)"
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
            style="color: rgba(0,0,0,.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [{ required: true, message: 'Please input a password.' }] }
          ]"
          type="password"
          placeholder="Password"
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0,0,0,.25)"
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
          ref="buttonSignUp"
          type="primary"
          html-type="submit"
          block
        >
          Join the community
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleSignUp(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$refs.buttonSignUp.loading = true
          console.log('Received values of form: ', values)
        }
      })
    },
  },
}
</script>
