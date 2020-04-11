<template>
  <div>
    <h2 v-t="{ path: 'title', args: { provider } }" />
    <p v-t="'subtitle'" />
    <a-form :form="form" @submit.prevent="createNew ? create() : link()">
      <a-form-item>
        <a-input
          v-decorator="[
            'username',
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
            'password',
            { rules: [
              { required: true, message: 'Please input your password.' },
              { min: 8, message: 'Password has to contain at least 8 characters.'}
            ] }
          ]"
          type="password"
          placeholder="Password"
        >
          <font-awesome-icon slot="prefix" icon="lock" />
        </a-input>
      </a-form-item>
      <a-form-item v-if="createNew">
        <div slot="extra">
          The player ID you specified does not exist. Repeat the password, and we shall create a new account for you.
        </div>
        <a-input
          v-decorator="['passwordComfirm',{ rules: [{ validator: comparePasswords }]}]"
          type="password"
          placeholder="Password Confirm"
        >
          <font-awesome-icon slot="prefix" icon="lock" />
        </a-input>
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
        {{ createNew ? 'Create' : 'Link' }}
      </a-button>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'ExternalAccountLink',
  data() {
    return {
      form: this.$form.createForm(this),
      createNew: false,
      captchaToken: null,
      loading: false,
    }
  },
  head() {
    return {
      title: 'Link - Cytoid'
    }
  },
  computed: {
    provider() {
      return this.$route.query.provider
    }
  },
  methods: {
    link() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$store.dispatch('login', { ...values, token: this.captchaToken })
          .then(async (user) => {
            await this.$axios.post(`/users/${user.id}/providers/${this.provider}`, {
              token: this.$route.query.token
            })
            return user
          })
          .then((user) => {
            this.loading = false
            this.$message.info('Welcome, ' + (user.uid))
            this.$router.go(-1)
            global.window.gtag('event', 'login', {
              event_category: 'auth',
              value: user.uid || 'nouid'
            })
          })
          .catch((error) => {
            this.loading = false
            if (error.response && error.response.status === 401) {
              this.$message.error('Username or password mismatch!')
              this.form.resetFields(['password'])
              // this.$captcha.reset()
              this.captchaToken = null
            } else if (error.response && error.response.status === 404) {
              this.createNew = true
            } else {
              this.handleErrorToast(error)
            }
          })
      })
    },
    create() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$axios.put('/users/', {
          token: this.$route.query.token,
          provider: this.provider,
          uid: values.username,
          password: values.password,
        })
          .then((res) => {
            const user = res.data.user
            this.loading = false
            this.$message.info('Welcome, ' + (user.uid))
            this.$router.go(-1)
            this.$store.commit('setUser', user)
            global.window.gtag('event', 'signup', {
              event_category: 'auth',
              value: values.uid
            })
          })
          .catch((error) => {
            this.loading = false
            this.handleErrorToast(error)
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
  i18n: {
    key: 'link'
  }
}
</script>
