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
        accept="image/*"
        :showUploadList="false"
        :customRequest="upload"
        @change="avatarUploaded"
      )
        a-avatar(:size="64" :src="$store.state.avatar")
      | Or
      a-button Upload from Gravatar
    a-form-item(label="Language" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input
    a-button(html-type="submit" type="primary").is-pulled-right Submit
</template>

<script>
import UploadMixin from '@/mixins/upload'
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
  mixins: [
    UploadMixin('avatar', 'image/*'),
  ],
  data() {
    return {
      form: this.$form.createForm(this),
      formValidation: formValidation(this.$store.state.user),
      loading: false,
    }
  },
  methods: {
    avatarUploaded({ file }) {
      if (file.status !== 'done') {
        return
      }
      this.$axios.get('/users/' + this.$store.state.user.id)
        .then((response) => {
          this.$store.commit('setAvatar', response.data.avatarURL)
          return this.$message.success('Avatar Updated!')
        })
    },
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
