<template lang="pug">
a-form(layout="horizontal" @submit.prevent="submit")
  div
    div(class="card-pre-header")
      p(v-t="'profile_header_title'")
  a-form-item(label="Cover image" :label-col="{ span: 20, sm: 5 }")
    captcha(invisible badge="bottomleft")
    background-upload(@change="headerUploaded" :src="headerURL")
  div
    div(class="card-pre-header")
      p(v-t="'profile_bio_title'")
  client-only: markdown-editor(
    :configs="{ spellChecker: false }"
    v-model="form.bio"
  )
  a-button.is-pulled-right(
    :loading="submitLoading"
    size="large"
    html-type="submit"
    type="primary"
    v-t="'save_btn'"
  )
</template>

<script>
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
  },
  i18n: {
    key: 'settings'
  }
}
</script>
