<template lang="pug">
a-card.avatar-upload(title="Avatar")
  captcha(invisible badge="bottomleft")
  a-upload(
    name="avatar"
    listType="picture-card"
    accept="image/*"
    :showUploadList="false"
    :customRequest="upload"
    @change="avatarUploaded"
  )
    a-avatar.avatar(:src="$store.state.avatar")
  template(v-if="!usingGravatar")
    a-button(
      :loading="avatarDeleteLoading",
      @click="avatarDelete"
    ) Use Gravatar
  span(v-else) You're using your avatar from #[a(href="https://gravatar.com/" target="_blank") Gravatar]
</template>

<script>
import UploadMixin from '@/mixins/upload'
export default {
  name: 'Avatar',
  mixins: [
    UploadMixin('avatar', 'image/*'),
  ],
  data() {
    return {
      avatarDeleteLoading: false,
    }
  },
  computed: {
    usingGravatar() {
      return this.$store.state.avatar?.includes('gravatar')
    }
  },
  methods: {
    avatarUploaded({ file }) {
      if (file.status !== 'done') {
        return
      }
      return this.updateAvatar()
        .then(() => this.$message.success('Avatar Updated!'))
    },
    avatarDelete() {
      this.avatarDeleteLoading = true
      return this.$axios.delete(`/users/${this.$store.state.user.id}/avatar`)
        .then(() => this.updateAvatar())
        .then(() => {
          this.$message.success('Using your Gravatar icon now!')
          this.avatarDeleteLoading = false
        })
    },
    updateAvatar() {
      return this.$axios.get('/users/' + this.$store.state.user.id)
        .then((response) => {
          this.$store.commit('setAvatar', response.data.avatarURL)
        })
    },
  },
}
</script>

<style>
.avatar-upload .ant-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.avatar-upload .avatar {
  width: 100%;
  height: 100%;
}
</style>
