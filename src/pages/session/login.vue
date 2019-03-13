<template lang="pug">
.section: .container
  .columns.is-centered
    .column.is-two-fifths-desktop.is-half-tablet
      .box
        img#login-panel-icon(src="~assets/icon.webp")
        b-field(label="Username / Email")
          b-input(v-model="form.username")
        b-field(label="Password")
          b-input(v-model="form.password" type="password" password-reveal)
        button.button.is-medium.is-fullwidth.is-primary(
          @click="login"
          :class="{'is-loading': loading}"
        ) Sign In
        nuxt-link#forgot-password(to="/register") Forgot Password
        hr
        .level.is-mobile
          .level-item: button.button.is-rounded.is-medium#discord-login: i.fab.fa-discord
          .level-item: button.button.is-rounded.is-medium#google-login: i.fab.fa-google
          .level-item: button.button.is-rounded.is-medium#twitter-login: i.fab.fa-twitter
          .level-item: button.button.is-rounded.is-medium#facebook-login: i.fab.fa-facebook
        p.has-text-grey
          | Don't have an account? &nbsp;
          nuxt-link(to="/session/register") Sign Up
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$axios.post('/session', this.form)
        .then((res) => {
          this.loading = false
          const data = res.data
          this.$store.commit('setUser', data.user)
          this.$toast.open({
            message: 'Login In Succeed',
            type: 'is-success'
          })
        })
        .catch((error) => {
          this.loading = false
          let message
          if (!error.response) message = 'Network Error'
          else if (error.response.status === 401) message = 'Your username or password was incorrect.'
          else message = 'Unknown Error'
          this.$toast.open({
            message: message,
            type: 'is-danger'
          })
        })
    }
  }
}
</script>

<style scoped>
#login-panel-icon {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  display: block;
  margin-bottom: 4rem;
  margin-top: 1rem;
}
#twitter-login {
  background-color: #1da1f2;
  color: white;
  border-style: none;
}
#facebook-login {
  background-color: #3b5998;
  color: white;
  border-style: none;
}
#discord-login {
  background-color: #7289da;
  color: white;
  border-style: none;
}
#forgot-password {
  display: block;
  text-align: right;
  margin-top: 0.5rem;
}
</style>
