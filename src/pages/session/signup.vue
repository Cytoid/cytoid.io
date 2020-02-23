<i18n locale="en" src="@/locale/en/signup.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/signup.json"/>
<i18n locale="zh-tw" src="@/locale/zh-TW/signup.json" />

<template>
  <div>
    <h2 v-t="'title'" style="margin-top: 1rem;" />
    <a-form
      :form="form"
      @submit.prevent="signUp"
    >
      <a-form-item>
        <div slot="extra" v-t="'id_requirement'" />
        <a-input
          v-decorator="[
            'uid',
            { rules: [{
              required: true,
              pattern: '^[a-z0-9_-]{3,16}$',
              message: $t('password_requirement'),
            }] }
          ]"
          :placeholder="$t('id_placeholder')"
        >
          <font-awesome-icon slot="prefix" icon="user" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'email',
            { rules: [
              { required: true, message: $t('email_field_error_required') },
              { type: 'email', message: $t('email_field_error_invalid') },
            ] }
          ]"
          html-type="email"
          :placeholder="$t('email_placeholder')"
        >
          <font-awesome-icon slot="prefix" icon="envelope" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="[
            'password',
            { rules: [
              { required: true, message: $t('password_field_error_required') },
              { min: 8, message: $t('password_field_error_invalid')},
            ] }
          ]"
          type="password"
          :placeholder="$t('password_field_placeholder')"
        >
          <font-awesome-icon slot="prefix" icon="lock" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="['passwordComfirm',{ rules: [{ validator: comparePasswords }]}]"
          type="password"
          :placeholder="$t('password_confirm_field_placeholder')"
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
                message: $t('tos_field_error_required')
              }],
            }
          ]"
        >
          <i18n path="tos_field_title">
            <nuxt-link v-t="'tos'" :to="{ name: 'legal-id', params: { id: 'terms' } }" />
          </i18n>
        </a-checkbox>
      </a-form-item>
      <captcha theme="dark" :token.sync="captchaToken" />
      <a-form-item>
        <a-button
          v-t="'join_btn'"
          class="card-button"
          type="primary"
          html-type="submit"
          block
          :loading="loading"
          :disabled="!captchaToken"
        />
      </a-form-item>
    </a-form>
    <div>
      <h2 v-t="'existing_user_title'" />
      <p v-t="'existing_user_content'" />
      <nuxt-link :to="{ name: 'session-login' }" replace>
        <a-button
          v-t="'login_btn'"
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
      captchaToken: null,
      loading: false,
    }
  },
  head() {
    return {
      title: 'Sign Up - Cytoid'
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
            this.$message.info('Registration Successful')
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
            // this.$captcha.reset()
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
