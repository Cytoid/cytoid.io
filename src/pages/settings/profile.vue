<template lang="pug">
form(@submit.prevent="submit")
  b-field(:label="$t('profile_header_title')")
    upload(:background="headerURL" type="headers" @upload="headerUploaded")
  b-field(:label="$t('birthday')")
    b-datepicker(
      icon="calendar"
      v-model="form.birthday"
    )
  client-only: b-field(:label="$t('profile_bio_title')")
    markdown-editor(v-model="form.bio")
  b-button.is-pulled-right(
    :loading="submitLoading"
    native-type="submit"
  ) {{$t('save_btn')}}
  .is-clearfix
</template>

<script>
import gql from 'graphql-tag'
import Upload from '@/components/Upload'
import { handleErrorBlock } from '@/plugins/antd'
import { parse } from 'date-fns'
export default {
  name: 'Profile',
  components: {
    Upload,
  },
  asyncData ({ store, error, app }) {
    return app.apolloProvider.defaultClient.query({
      query: gql`query GetSettingsProfile($id: ID!) {
        profile(id: $id) {
          id
          bio
          birthday
          header {
           stripe
          }
        }
      }`,
      variables: { id: store.state.user.id }
    }).then(({ data }) => data?.profile)
      .then((profile) => {
        const response = {
          form: {
            bio: profile?.bio,
          },
          headerURL: profile?.header?.stripe,
        }
        if (profile?.birthday) {
          response.form.birthday = parse(profile.birthday, 'yyyy-MM-dd', new Date())
        } else {
          response.form.birthday = null
        }
        return response
      })
      .catch(err => handleErrorBlock(err, error))
  },
  data () {
    return {
      form: {
        bio: null,
        birthday: null,
      },
      headerURL: null,
      submitLoading: false,
    }
  },
  methods: {
    headerUploaded (path) {
      this.$apollo.mutate({
        mutation: gql`mutation UpdateProfileHeader($path: String!) {
          result: updateProfileHeader(path: $path) {
            stripe
          }
        }`,
        variables: { path }
      })
        .then((data) => {
          this.$buefy.toast.open({
            message: 'Profile Header Updated',
            type: 'is-success',
          })
          this.headerURL = data.data?.result?.stripe
        })
        .catch(error => this.handleErrorToast(error))
    },
    submit () {
      this.submitLoading = true
      this.$apollo.mutate({
        mutation: gql`mutation UpdateProfile($input: ProfileInput!) {
          result: updateProfile(input: $input)
        }`,
        variables: {
          input: this.form,
        }
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Profile Updated',
            type: 'is-success',
          })
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
