<i18n locale="en">
{
  "title": "Already have a Cytoid account?",
  "subtitle": "Please sign in below."
}
</i18n>
<i18n locale="zh-cn">
{
  "title": "已有Cytoid账号？",
  "subtitle": "请在下方登录"
}
</i18n>
<i18n locale="zh-tw">
{
  "title": "已有Cytoid賬號？",
  "subtitle": "請在下方登錄"
}
</i18n>

<template>
  <div>
    <div>
      <h2 v-t="'title'" />
      <p v-t="'subtitle'" />
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
    <div class="external-login-level">
      <font-awesome-icon v-if="externalLoginLoading" icon="spinner" spin />
      <template v-else>
        <a-button class="icon-button" shape="circle" @click="signInWithProvider('facebook')">
          <font-awesome-icon :icon="['fab', 'facebook-f']" />
        </a-button>
        <a-button class="icon-button" shape="circle" @click="signInWithProvider('google')">
          <font-awesome-icon :icon="['fab', 'google']" />
        </a-button>
        <a-button class="icon-button" shape="circle" @click="signInWithProvider('discord')">
          <font-awesome-icon :icon="['fab', 'discord']" />
        </a-button>
      </template>
    </div>
    <div>
      <h2>New to Cytoid?</h2>
      <p>Sign up to access all Cytoid multiplayer features. It takes less than 30 seconds!</p>
      <nuxt-link to="./signup" replace>
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
      externalLoginLoading: false,
      captchaToken: null,
      form: this.$form.createForm(this),
    }
  },
  head() {
    return {
      title: 'Login - Cytoid'
    }
  },
  methods: {
    signInWithProvider(provider) {
      this.externalLoginLoading = true
      window.addEventListener('message', this.providerResponded)
      window.open(process.env.apiURL + '/session/external/' + provider)
    },
    providerResponded(event) {
      window.removeEventListener('message', this.providerResponded)
      console.log(event.data)
      console.log(event.origin)
      /*
      if (process.event.origin !== process.env.apiURL) {
        return
      }
      */
      this.externalLoginLoading = false
      if (event.data.user) {
        const user = event.data.user
        this.$store.commit('setUser', user)
        this.$store.commit('setAvatar', user.avatarURL)
        this.$message.info('Welcome, ' + (user.uid))
        this.$router.go(-1)
      } else if (event.data.token && event.data.provider) {
        this.$router.replace({
          name: 'session-link',
          query: { token: event.data.token, provider: event.data.provider },
        })
      }
    },
    signIn() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$store.dispatch('login', { ...values, token: this.captchaToken })
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
            this.$captcha.reset()
            this.captchaToken = null
            this.form.resetFields(['password'])
            if (error.response && error.response.status === 401) {
              this.$message.error('Username or password mismatch!')
            } else if (error.response && error.response.status === 404) {
              this.$message.error('User does not exist!')
            } else {
              this.handleErrorToast(error)
            }
          })
      })
    },
  },
}
</script>

<style>
.external-login-level {
  display: flex;
  justify-content: space-around;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
