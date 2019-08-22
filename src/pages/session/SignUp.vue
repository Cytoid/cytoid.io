<i18n locale="en">
{
  "title": "Sign Up"
}
</i18n>
<i18n locale="zh-cn">
{
  "title": "注册"
}
</i18n>
<i18n locale="zh-tw">
{
  "title": "註冊"
}
</i18n>

<template>
  <div>
    <nuxt-link to="./login">
      <a-button type="primary" shape="circle" size="large">
        <font-awesome-icon icon="chevron-left" />
      </a-button>
    </nuxt-link>
    <h2 v-t="'title'" style="margin-top: 1rem;" />
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
        <a-input
          v-decorator="['passwordComfirm',{ rules: [{ validator: comparePasswords }]}]"
          type="password"
          placeholder="Password Confirm"
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
          class="card-button"
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
            const user = res.data.user
            this.loading = false
            this.$message.info('Registration succeed')
            this.$router.go(-1)
            this.$store.commit('setAvatar', user.avatarURL)
            this.$store.commit('setUser', user)
            global.window.gtag('event', 'signup', {
              event_category: 'auth',
              value: values.uid
            })
          })
          .catch((error) => {
            this.handleErrorToast(error)
            this.loading = false
            this.$captcha.reset()
            this.captchaToken = null
          })
      })
    },
    comparePasswords(rule, value, cdb) {
      if (value && value !== this.form.getFieldValue('password')) {
        cdb('Passwords inconsistent!')
      } else {
        cdb()
      }
    },
  },
}
</script>
