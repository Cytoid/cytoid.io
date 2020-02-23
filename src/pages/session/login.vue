<i18n locale="en" src="@/locale/en/login.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/login.json" />
<i18n locale="zh-tw" src="@/locale/zh-TW/login.json" />

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
              { rules: [{ required: true, message: $t('username_field_error_required') }] }
            ]"
            :placeholder="$t('username_field_placeholder')"
          >
            <font-awesome-icon slot="prefix" icon="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              { rules: [{ required: true, message: $t('password_field_error_required') }] }
            ]"
            type="password"
            :placeholder="$t('password_field_placeholder')"
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
            {{ $t('remember_me_checkbox_title') }}
          </a-checkbox>
          <nuxt-link to="/session/reset" class="is-pulled-right">
            <small v-t="'forgot_password_link_title'" />
          </nuxt-link>
        </a-form-item>
        <captcha theme="dark" :token.sync="captchaToken" style="margin-bottom: 1rem;" />
        <a-button
          v-t="'login_btn'"
          class="card-button"
          type="primary"
          html-type="submit"
          :loading="loading"
          :disabled="!captchaToken"
          block
        />
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
      <h2 v-t="'new_user_welcome_title'" />
      <p v-t="'new_user_welcome_content'" />
      <nuxt-link :to="{ name: 'session-signup' }" replace>
        <a-button
          v-t="'signup_btn'"
          class="card-button"
          type="primary"
          html-type="submit"
          block
        />
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
        this.$message.info(this.$t('login_snack_bar', { name: user.name || user.uid }))
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
            this.$message.info(this.$t('login_snack_bar', { name: user.name || user.uid }))
            this.$router.go(-1)
            global.window.gtag('event', 'login', {
              event_category: 'auth',
              value: user.uid || 'nouid'
            })
          })
          .catch((error) => {
            this.loading = false
            // this.$captcha.reset()
            // this.captchaToken = null
            // For temp disabled captcha
            this.form.resetFields(['password'])
            if (error.response && error.response.status === 401) {
              this.$message.error(this.$t('login_password_error'))
            } else if (error.response && error.response.status === 404) {
              this.$message.error(this.$t('login_username_error'))
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
