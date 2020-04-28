<template lang="pug">
form(@submit.prevent="submit")
  b-field(:label="$t('profile_header_title')")
    background-upload(@change="headerUploaded" :src="headerURL")
  b-field(:label="$t('birthday')")
    b-datepicker(icon="calendar")
  client-only: b-field(:label="$t('profile_bio_title')")
    markdown-editor(
      :configs="{ spellChecker: false }"
      v-model="form.bio"
    )
  b-button.is-pulled-right(
    :loading="submitLoading"
    native-type="submit"
  ) {{$t('save_btn')}}
  .is-clearfix
</template>

<script>
import UploadMixin from '@/mixins/upload'
import BackgroundUpload from '@/components/BackgroundUpload.vue'
import gql from 'graphql-tag'
import { handleErrorBlock } from '../../plugins/antd'
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
  asyncData({ store, error, app }) {
    return app.apolloProvider.defaultClient.query({
      query: gql`query GetSettingsProfile($id: ID!) {
        profile(id: $id) {
          id
          bio
          birthday
        }
      }`,
      variables: { id: store.state.user.id }
    }).then(({ data }) => data?.profile)
      .then(profile => ({
        form: {
          bio: profile?.bio,
          birthday: profile?.birthday,
        }
      }))
      .catch(err => handleErrorBlock(err, error))
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
