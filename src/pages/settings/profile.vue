<template lang="pug">
a-form(:form="form" layout="horizontal" @submit.prevent="submit")
  a-form-item(label="Header Image" :label-col="{ span: 20, sm: 5 }")
    captcha(invisible badge="bottomleft")
    a-upload-dragger.header-uploader(
      name="header"
      :showUploadList="false"
      :customRequest="upload"
      @change="headerUploaded"
      :style="headerURL && { '--bg-url': `url(\"${headerURL}\")` }"
    )
      p.ant-upload-drag-icon
        a-icon(type="inbox")
      p.ant-upload-text Profile Header Image
      p.ant-upload-hint Click or drag the image to this area to upload
  no-ssr: markdown-editor(
    :configs="{ spellChecker: false }"
    v-model="form.bio"
  )
  a-form-item(label="Birthday" :label-col="{ span: 20, sm: 5 }" :wrapper-col="{ span: 24, sm: 19 }")
    a-date-picker(v-model="birthday")
  a-button.is-pulled-right(
    :loading="submitLoading"
    size="large"
    html-type="submit"
    type="primary"
  ) Submit
</template>

<script>
import moment from 'moment'
import UploadMixin from '@/mixins/upload'

export default {
  name: 'Profile',
  mixins: [
    UploadMixin('headers', 'image/*'),
  ],
  data() {
    return {
      form: {
        bio: null,
        birthday: null,
      },
      submitLoading: false,
      headerURL: null,
    }
  },
  computed: {
    birthday: {
      get() { return this.form.birthday && moment(this.form.birthday) },
      set(value) { this.form.birthday = value.toISOString() },
    }
  },
  asyncData({ $axios, store }) {
    return $axios.get('/profile/' + store.state.user.id)
      .then((response) => {
        const profile = response.data
        return {
          headerURL: profile.headerURL,
          form: {
            bio: profile.bio,
            birthday: profile.birthday,
          }
        }
      })
  },
  methods: {
    headerUploaded({ file }) {
      if (file.status !== 'done') {
        return
      }
      this.$axios.get('/profile/' + this.$store.state.user.id)
        .then((response) => {
          this.$message.success('Profile Header Image Updated!')
          this.headerURL = response.data.headerURL
          window.localStorage.setItem('profile:header', this.headerURL)
        })
    },
    submit() {
      this.submitLoading = true
      this.$axios.put('/profile/' + this.$store.state.user.id, this.form)
        .then(() => {
          this.$message.success('Profile Updated')
        })
        .catch(err => this.$message.error(err.response?.data?.message || err.message))
        .then(() => {
          this.submitLoading = false
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
