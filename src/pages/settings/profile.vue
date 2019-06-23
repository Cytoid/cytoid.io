<template lang="pug">
a-form(:form="form" layout="horizontal")
  no-ssr: markdown-editor(
    v-model="profile.bio"
    :configs="{ spellChecker: false }"
  )
  a-form-item(label="Header Image" :label-col="{ span: 20, sm: 5 }")
    a-upload-dragger.header-uploader(
      name="header"
      :showUploadList="false"
      :customRequest="upload"
      @change="avatarUploaded"
      :style="{ '--bg-url': `url(\"${profile.headerURL}\")` }"
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
import UploadMixin from '@/mixins/upload'
export default {
  name: 'Profile',
  mixins: [
    UploadMixin('headers', 'image/*'),
  ],
  data() {
    return {
      form: this.$form.createForm(this),
      profile: null
    }
  },
  asyncData({ $axios, store }) {
    return $axios.get('/profile/' + store.state.user.id)
      .then(response => ({ profile: response.data }))
  },
  methods: {
    avatarUploaded({ file }) {
      if (file.status !== 'done') {
        return
      }
      this.$axios.get('/profile/' + this.$store.state.user.id)
        .then((response) => {
          this.$message.success('Profile Header Image Updated!')
          this.profile = response.data
          window.localStorage.setItem('profile:header', this.profile.headerURL)
        })
    },
  }
}
</script>

<style lang="less">
.header-uploader .ant-upload.ant-upload-drag {
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(fade(@shade2, 40%), fade(@shade1, 60%)), var(--bg-url);
}
</style>
