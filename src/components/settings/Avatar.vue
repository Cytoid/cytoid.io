<template lang="pug">
div
  div(class="card-pre-header")
    p Avatar
  a-card.avatar-upload
    captcha(invisible badge="bottomleft")
    a-upload(
      name="avatar"
      listType="picture-card"
      accept="image/*"
      :showUploadList="false"
      :customRequest="upload"
      @change="avatarUploaded"
      style="margin-bottom: 16px;"
    )
      avatar.avatar(:src="$store.state.avatar")
    template(v-if="!usingGravatar")
      a-button(
        class="card-button"
        :loading="avatarDeleteLoading",
        @click="avatarDelete"
      ) Click to use Gravatar
    span(v-else) You're using your avatar from #[a(href="https://gravatar.com/" target="_blank" style="font-weight:bold") Gravatar]!
</template>

<script>
import UploadMixin from '@/mixins/upload'
export default {
  name: 'AvatarPanel',
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
  mounted() {
    this.$axios.get('/profile/' + this.$store.state.user.id)
      .then((res) => {
        this.$store.commit('setHeader', res.data.headerURL)
        this.$store.commit('setAvatar', res.data.user.avatarURL)
      })
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
.avatar-upload .ant-upload {
  margin: 0;
}
.avatar-upload .avatar {
  border-radius: 3px;
}
</style>
