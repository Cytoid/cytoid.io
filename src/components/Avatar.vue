<template>
  <img
    class="cytoid-avatar"
    :src="avatarSrc"
    :style="fixed && { height: size + 'px', width: size + 'px' }"
    alt="avatar"
    @error="errored=true"
  >
</template>

<script>
const URL = process.server ? require('url').URL : window.URL
const defaultAvatarURL = require('@/assets/images/avatar.jpg')

export default {
  name: 'Avatar',
  props: {
    size: {
      type: Number,
      default: null,
    },
    src: {
      type: String,
      default: defaultAvatarURL,
    },
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      errored: false,
    }
  },
  computed: {
    avatarSrc() {
      const path = this.errored ? defaultAvatarURL : this.src
      const url = new URL(path, process.env.webURL)
      url.searchParams.append('d', '404')
      if (!this.size) {
        return url.href
      }
      if (url.host.includes('gravatar')) {
        // Served from Gravatar
        url.searchParams.append('s', this.size)
      }
      return url.href
    }
  }
}
</script>

<style>
.cytoid-avatar {
  max-height: 100%;
  max-width: 100%;
  border-radius: 50%;
}
</style>
