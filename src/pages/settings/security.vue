<template lang="pug">
.section
  a-card(title="Password")
    a-form(:form="form" @submit.prevent="submit")
      a-form-item(label="Password" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }")
        a-input(
          type="password"
          placeholder="Old Password"
          v-decorator="['old',{ rules: [{ required: true, message: 'The old password is required' }] }]"
        )
      a-form-item(label="New Password" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }")
        a-input(
          type="password"
          v-decorator="['new',{ rules: [{ required: true, message: 'The new password is required' }, , { min: 8, message: 'Password has to be at least 8 characters.'}] }]"
        )
      a-form-item(label="Password Confirm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }")
        a-input(
          type="password"
          v-decorator="['newConfirm',{ rules: [{ validator: comparePasswords }, { required: true, message: 'Please input your password again' }]}]"
        )
      a-button.card-button(html-type="submit" :loading="loading") Submit
  a-card.external-login(title="Third-party Login")
    a-button(
      v-for="provider in providers"
      :key="provider.id" :type="externals.includes(provider.id) ? 'danger' : 'default'"
      :loading="providersLoading === provider.id"
      @click="externals.includes(provider.id) ? unlink(provider.id) : link(provider.id)"
    )
      font-awesome-icon(:icon="['fab', provider.icon || provider.id]")
      | {{provider.title}}
</template>

<script>
export default {
  name: 'Security',
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      externals: [],
      providers: [
        { id: 'facebook', icon: 'facebook-f', title: 'Facebook' },
        { id: 'google', title: 'Google' },
        { id: 'discord', title: 'Discord' }
      ],
      providersLoading: null,
    }
  },
  asyncData({ $axios, store }) {
    return $axios.get(`/users/${store.state.user.id}/providers`)
      .then(res => ({
        externals: res.data
      }))
  },
  methods: {
    comparePasswords(rule, value, cdb) {
      if (value && value !== this.form.getFieldValue('new')) {
        cdb('Passwords inconsistent!')
      } else {
        cdb()
      }
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (err) { return }
        this.loading = true
        delete values.newConfirm
        this.$axios.patch('/session/password', values)
          .then(() => {
            this.$message.success('Password Changed')
          })
          .catch(this.handleErrorToast)
          .then(() => {
            this.loading = false
          })
      })
    },
    link(provider) {
      this.providersLoading = provider
      window.open(process.env.apiURL + '/session/external/' + provider)
      window.addEventListener('message', this.providerResponded)
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
      if (event.data.user) {
        this.providersLoading = null
        const user = event.data.user
        this.$store.commit('setUser', user)
        this.$store.commit('setAvatar', user.avatarURL)
        this.$message.info(`You're now logged in as ${user.uid}.`)
      } else if (event.data.token && event.data.provider) {
        this.$axios.post(`/users/${this.$store.state.user.id}/providers/${event.data.provider}`, {
          token: event.data.token
        })
          .then(() => {
            this.providersLoading = null
            this.externals.push(event.data.provider)
          })
      }
    },
    unlink(provider) {
      this.providersLoading = provider
      return this.$axios.delete(`/users/${this.$store.state.user.id}/providers/${provider}`)
        .then(() => {
          this.providersLoading = null
          this.externals.splice(this.externals.indexOf(provider), 1)
        })
    }
  }
}

</script>

<style lang="less">
.external-login {
  margin-top: 2rem;
  .ant-btn svg {
    margin-right: 0.5rem;
  }
}
</style>
