<template lang="pug">
a-card(title="User Info")
  a-form(:form="form" layout="horizontal" @submit.prevent="save" :loading="loading")
    a-form-item(label="UID" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input(
        addonBefore="https://cytoid.io/profile/"
        v-decorator="['uid', formValidation.uid]"
        )
    a-form-item(label="Display Name" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input(v-decorator="['name', formValidation.name]")
    a-form-item.avatar-upload(label="Avatar" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-upload(
        name="avatar"
        listType="picture-card"
        class="avatar-uploader"
        :showUploadList="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      )
        img(v-if="$store.state.user.avatarURL" :src="$store.state.user.avatarURL" alt="avatar")
      | Or
      a-button Upload from Gravatar
    a-form-item(label="Language" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input
    a-button(html-type="submit" type="primary").is-pulled-right Submit
</template>

<script>
const formValidation = user => ({
  uid: {
    rules: [
      { required: true, pattern: '^[a-z0-9_-]{3,16}$', message: '3-16 lowercase letters, numbers, _ or -' }
    ],
    initialValue: user.uid,
  },
  name: {
    initialValue: user.name,
  }
})
export default {
  name: 'Info',
  data() {
    return {
      form: this.$form.createForm(this),
      formValidation: formValidation(this.$store.state.user),
      loading: false,
    }
  },
  methods: {
    save() {
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        this.loading = true
        this.$axios.put('/users/' + this.$store.state.user.id, values)
          .then((res) => {
            this.loading = false
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
            this.$message.error(error.response?.data?.message || error.message)
          })
      })
    }
  }
}
</script>

<style>
.avatar-upload .ant-form-item-children {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
</style>
