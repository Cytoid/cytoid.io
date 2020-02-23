<i18n locale="en" src="@/locale/en/settings.json" />
<i18n locale="zh-cn" src="@/locale/zh-CN/settings.json" />

<template lang="pug">
div
  div(class="card-pre-header")
    p(v-t="'avatar_title'")
  .box.avatar-upload
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
        v-t="'avatar_use_gravatar_btn'")
    i18n(path="avatar_using_gravatar" tag="span" v-else)
      a(href="https://gravatar.com/" target="_blank" style="font-weight:bold" v-t="'gravatar'")
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

<style scoped>
.avatar-upload {
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
