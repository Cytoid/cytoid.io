<template lang="pug">
.section: .container
  .columns.is-centered
    .column.is-two-thirds
      form.box(@submit.prevent="signUp")
        h1.title.is-4 Sign Up
        h2.subtitle.is-6 Join the Cytoid community to get involved in contests, quests and more!
        b-field(label="Username" :type="{'is-danger': errors.has('username')}"  :message="errors.first('username')")
          b-input(v-model="form.name" name="username" v-validate="'required'")
        b-field(label="Email" :type="{'is-danger': errors.has('email')}"  :message="errors.first('email')")
          b-input(v-model="form.email" type="email" name="email" v-validate="'required|email'")
        b-field(label="Password" :type="{'is-danger': errors.has('password')}"  :message="errors.first('password')")
          b-input(v-model="form.password" type="password" name="password" v-validate="'required|password|min:8'" ref="password")
        b-field(label="Password Again" :type="{'is-danger': errors.has('password_confirm')}"  :message="errors.first('password_confirm')")
          b-input(v-model="passwordConfirm" type="password" name="password_confirm" v-validate="'required|confirmed:password'" data-vv-as="password")
        .field:  b-checkbox(v-model="agreeTerms")
          | I agree to the &nbsp;
          a(href="#") terms and conditions
        button.button.is-primary(
          type="submit"
          :disabled="!agreeTerms",
          :class="{ 'is-loading': loading }") Sign Up
</template>

<script>
export default {
  name: 'Register',
  inject: ['$validator'],
  data() {
    return {
      agreeTerms: false,
      loading: false,
      form: {
        name: '',
        password: '',
        email: '',
      },
      passwordConfirm: ''
    }
  },
  methods: {
    async signUp() {
      const validationResult = await this.$validator.validateAll()
      if (!validationResult) {
        return
      }
      this.loading = true
      this.$axios.post('/users', this.form, {
        withCredentials: true,
      })
        .then((res) => {
          const data = res.data
          this.loading = false
          this.$store.dispatch('login', data.token)
          this.$toast.open({
            message: 'Registration Succeed!!',
            type: 'is-success'
          })
        })
        .catch((error) => {
          this.loading = false
          if (error.response && error.response.data) {
            const data = error.response.data
            if (data.message === 'duplicated email address') {
              const field = this.$validator.fields.find({ name: 'email', scope: this.$options.scope })
              this.$validator.errors.add({
                id: field.id,
                field: 'email',
                msg: data.message,
                scope: this.$options.scope,
              })
              field.setFlags({
                invalid: true,
                valid: false,
                validated: true,
              })
              return
            }
            this.$toast.open({
              message: 'Registration Failed (Unknown Reason)',
              type: 'is-danger'
            })
          } else {
            throw error
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
