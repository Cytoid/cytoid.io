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
              'player_id',
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
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
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
          :loading="loading"
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
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          console.log('Received values of form: ', values)
        }
      })
    },
  },
}
</script>
