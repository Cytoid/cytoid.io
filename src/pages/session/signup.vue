<template lang="pug">
  div
    h2(v-t="'title'")
    ValidationObserver(v-slot="{ invalid, handleSubmit }" ref="validator" slim): form(@submit.prevent="handleSubmit(signUp)")
      ValidationProvider(slim
        rules="uid|required"
          v-slot="{ errors, valid }"
          :name="$t('username_field_label')"
          vid="uid")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.uid" icon="user" :placeholder="$t('id_placeholder')")
      ValidationProvider(slim
        rules="email|required"
        v-slot="{ errors, valid }"
        :name="$t('email_field_label')")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.email" icon="envelope" :placeholder="$t('email_placeholder')")
      ValidationProvider(slim
        rules="password|required"
        v-slot="{ errors, valid }"
        :name="$t('password_field_label')"
        vid="password")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.password" type="password" icon="lock" :placeholder="$t('password_field_placeholder')")
      ValidationProvider(slim
        rules="required|password_confirm:@password"
        v-slot="{ errors, valid }"
        :name="$t('password_confirm_field_label')"
        vid="confirm")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.confirm" type="password" icon="lock" :placeholder="$t('password_confirm_field_placeholder')")
      ValidationProvider(slim
        v-slot="{ errors, valid }"
        vid="tos")
        b-field(
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-checkbox(v-model="form.tos")
            i18n(path="tos_field_title")
              nuxt-link(:to="{ name: 'legal-id', params: { id: 'terms' } }") {{ $t('tos') }}
      captcha.has-text-centered(v-model="captchaToken" size="compact" style="margin-top: 1rem; ")
      b-button(native-type="submit" expanded :loading="loading" style="margin-bottom: 1rem;" :disabled="invalid || !captchaToken") {{$t('join_btn')}}
      h2(v-t="'existing_user_title'")
      p(v-t="'existing_user_content'")
      nuxt-link.button.is-fullwidth(:to="{ name: 'session-login' }" replace) {{$t('login_btn')}}
</template>

<script>
import Captcha from '@/components/Captcha'
export default {
  components: {
    Captcha,
  },
  data() {
    return {
      captchaToken: null,
      loading: false,
      form: {
        uid: null,
        email: null,
        password: null,
        confirm: null,
        tos: false,
      }
    }
  },
  head() {
    return {
      title: 'Sign Up - Cytoid'
    }
  },
  methods: {
    signUp() {
      if (!this.form.tos) {
        this.$refs.validator.setErrors({
          tos: [this.$t('tos_field_error_required')]
        })
        return
      }
      this.loading = true
      this.$axios.put('/session', {
        uid: this.form.uid,
        email: this.form.email,
        password: this.form.password,
        captcha: this.captchaToken
      })
        .then((res) => {
          const user = res.data.user
          this.loading = false
          this.$buefy.toast.open({
            message: 'Registration Successful',
          })
          this.$router.replace({ name: 'settings-account' })
          this.$store.commit('setUser', user)
          global.window.gtag('event', 'signup', {
            event_category: 'auth',
            value: this.form.uid
          })
        })
        .catch((error) => {
          this.handleErrorToast(error)
          this.loading = false
          this.captchaToken = null
        })
    },
  },
  i18n: {
    key: 'signup'
  }
}
</script>
