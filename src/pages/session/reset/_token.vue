<template lang="pug">
  div(v-if="state === 0")
    h4.is-size-4.has-text-centered Reset your password
    h1.has-text-centered.is-size-1: font-awesome-icon(icon="file-archive")
    ValidationObserver(v-slot="{ invalid, handleSubmit }" ref="validator" slim): form(@submit.prevent="handleSubmit(submit)")
      ValidationProvider(slim
      rules="password|required"
        v-slot="{ errors, valid }"
        :name="$t('new_password_field_label')"
        vid="password")
        b-field(
          :label="$t('new_password_field_label')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.new" type="password")
      ValidationProvider(slim
      rules="required|password_confirm:@password"
        v-slot="{ errors, valid }"
        :name="$t('password_confirm_field_label')"
        vid="confirm")
        b-field(
          :label="$t('password_confirm_field_label')"
          :type="{ 'is-danger': errors[0], 'is-success': valid }"
          :message="errors")
          b-input(v-model="form.confirm" type="password")
      b-button(native-type="submit" expanded :loading="loading") {{$t('submit_btn')}}
  div(v-else-if="state === 1")
    h4.is-size-4.has-text-centered Success!
    h1.has-text-centered.is-size-1: font-awesome-icon(icon="check-circle")
    nuxt-link.button.is-fullwidth(:to="{ name: 'session-login' }") {{$t('login_btn')}}
  div(v-else)
    h4.is-size-4.has-text-centered Oops...
    h1.has-text-centered.is-size-1: font-awesome-icon(icon="exclamation-triangle")
    p This is a bit awkward, but the link expired.
    nuxt-link.button.is-fullwidth(to="/session/reset") Try Again
</template>

<script>
import gql from 'graphql-tag'

export default {
  data () {
    return {
      loading: false,
      form: {
        new: null,
        confirm: null,
      },
      state: 0, // 0 - nature, -1 - wrong token, 1 - success
    }
  },
  methods: {
    submit () {
      const password = this.form.new
      this.loading = true
      setTimeout(() => { this.loading = false }, 1000)
      this.$apollo.mutate({
        mutation: gql`mutation ChangePasswordWithToken($password: String!, $token: String!) {
            success: changePasswordWithToken(password: $password, token: $token)
        }`,
        variables: { password, token: this.$route.params.token }
      })
        .then((res) => {
          const success = res.data?.success
          if (success) {
            this.state = 1
          } else {
            this.state = -1
          }
        })
        .catch(error => this.handleErrorToast(error))
        .then(() => {
          this.loading = false
        })
    },
  },
  head () {
    return {
      title: 'Confirm - Reset Password - Cytoid'
    }
  },
}
</script>
