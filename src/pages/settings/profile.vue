<template lang="pug">
a-form(layout="horizontal" @submit.prevent="submit")
  a-form-item(label="Header Image" :label-col="{ span: 20, sm: 5 }")
    captcha(invisible badge="bottomleft")
    background-upload(@change="headerUploaded" :src="headerURL")
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
import BackgroundUpload from '@/components/BackgroundUpload.vue'
export default {
  name: 'Profile',
  components: {
    BackgroundUpload,
  },
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
    }
  },
  computed: {
    birthday: {
      get() { return this.form.birthday && moment(this.form.birthday) },
      set(value) { this.form.birthday = value.toISOString() },
    },
    headerURL: {
      get() { return this.$store.state.header },
      set(value) { this.$store.commit('setHeader', value) },
    }
  },
  asyncData({ $axios, store }) {
    return $axios.get('/profile/' + store.state.user.id)
      .then((response) => {
        const profile = response.data
        store.commit('setHeader', profile.headerURL)
        return {
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
        })
    },
    submit() {
      this.submitLoading = true
      this.$axios.put('/profile/' + this.$store.state.user.id, this.form)
        .then(() => {
          this.$message.success('Profile Updated')
        })
        .catch(error => this.handleErrorToast(error))
        .then(() => {
          this.submitLoading = false
        })
    },
  }
}
</script>
