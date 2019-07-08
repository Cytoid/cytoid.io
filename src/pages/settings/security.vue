<template lang="pug">
.section
  a-card(title="Password")
    a-form(:form="form" @submit.prevent="submit")
      a-form-item(label="Password" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }")
        a-input(
          type="password"
          placeholder="Old Password"
          v-decorator="['old',{ rules: [{ required: true, message: 'The old password is required' }] }]"
        )
      a-form-item(label="New Password" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }")
        a-input(
          type="password"
          v-decorator="['new',{ rules: [{ required: true, message: 'The new password is required' }, , { min: 8, message: 'Password has to be at least 8 characters.'}] }]"
        )
      a-form-item(label="Password Confirm" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }")
        a-input(
          type="password"
          v-decorator="['newConfirm',{ rules: [{ validator: comparePasswords }, { required: true, message: 'Please input your password again' }]}]"
        )
      a-button.card-button(html-type="submit" :loading="loading") Submit
</template>

<script>
export default {
  name: 'Security',
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
    }
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
  }
}

</script>
