<template lang="pug">
.section
  .heading(v-t="'avatar_title'")
  .box
    b-field
      upload.avatar-upload(:background="avatarURL" type="avatar" @upload="avatarUploaded" icon :captchaFunc="captchaFunc")
</template>

<script>
import gql from 'graphql-tag'
import Upload from '@/components/Upload'
export default {
  name: 'AvatarPanel',
  components: {
    Upload,
  },
  props: {
    captchaFunc: {
      type: Function,
      default: null,
    }
  },
  data () {
    return {
      avatarURL: null
    }
  },
  mounted () {
    this.avatarURL = this.$store.getters.avatarURL(128)
  },
  methods: {
    avatarUploaded (path) {
      this.avatarURL = null
      this.$apollo.mutate({
        mutation: gql`mutation UpdateAvatar($path: String) {
          result: setAvatar(path: $path) {
            large
          }
        }`,
        variables: { path }
      })
        .then((res) => {
          this.avatarURL = res.data?.result?.large
          this.$buefy.toast.open({
            message: 'Avatar updated',
            type: 'is-success'
          })
        })
    },
  },
  i18n: {
    key: 'settings'
  }
}
</script>

<style>
.avatar-upload .bg-upload .upload-draggable {
  height: 128px;
  width: 128px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
