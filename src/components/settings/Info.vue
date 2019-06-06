<template lang="pug">
a-card(title="User Info")
  a-form(:form="form" layout="horizontal")
    a-form-item(label="UID" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input(addonBefore="https://cytoid.io/profile/" defaultValue="neo")
    a-form-item(label="Display Name" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input
    a-form-item.avatar-upload(label="Avatar" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-upload(
        name="avatar"
        listType="picture-card"
        class="avatar-uploader"
        :showUploadList="false"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      )
        img(v-if="$auth.user.avatarURL" :src="$auth.user.avatarURL" alt="avatar")
      | Or
      a-button Upload from Gravatar
    a-form-item(label="Language" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
      a-input
    a-button(html-type="submit" type="primary").is-pulled-right Submit
</template>

<script>
export default {
  name: 'Info',
  data() {
    return {
      form: this.$form.createForm(this),
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
