<template>
  <div>
    <div>
      <h2>Already have a Cytoid account?</h2>
      <p>Please sign in below.</p>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleLogin"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: 'Please input your player ID or email address.' }] }
            ]"
            placeholder="Player ID / Email address"
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
              'password',
              { rules: [{ required: true, message: 'Please input your password.' }] }
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
              'remember',
              {
                valuePropName: 'checked',
                initialValue: true,
              }
            ]"
          >
            Remember me
          </a-checkbox>
          <a
            href=""
            style="float: right;"
          >
            Forgot password
          </a>
          <a-button
            ref="buttonLogin"
            type="primary"
            html-type="submit"
            style="width: 100%;"
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
      <a-button
        type="primary"
        html-type="submit"
        style="width: 100%;"
      >
        Sign up
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this)
  },
  methods: {
    handleLogin(e) {
      e.preventDefault()
      this.session.validateFields((err, values) => {
        if (!err) {
          this.$refs.buttonLogin.loading = true // TODO: 帮我看下这样写会不会 anti-pattern
          console.log('Received values of form: ', values)
        }
      })
    },
  },
}
</script>
