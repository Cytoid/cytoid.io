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
const imagesHostname = (new URL(process.env.imageURL)).host
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
      if (!this.size) {
        return url.href
      }
      if (url.host.includes('gravatar')) {
        // Served from Gravatar
        url.searchParams.append('s', this.size)
        url.searchParams.append('d', '404')
      } else {
        // Served from images.cytoid.io
        url.host = imagesHostname
        url.searchParams.set('max-w', this.size)
        url.searchParams.set('max-h', this.size)
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
