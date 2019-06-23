<template lang="pug">
a-form(:form="form" layout="horizontal")
  a-form-item(label="Bio" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
    a-textarea
  a-form-item(label="Header Image" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
    a-upload-dragger(
      name="header"
      class="avatar-uploader"
      :showUploadList="false"
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    )
      p.ant-upload-drag-icon
        a-icon(type="inbox")
      p.ant-upload-text Click or drag file to this area to upload
      p.ant-upload-hint Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
  a-form-item(label="Birthday" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
    a-date-picker
  a-form-item(label="Region" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
    a-input
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      form: this.$form.createForm(this),
    }
  }
}
</script>
