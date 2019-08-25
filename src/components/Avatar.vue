<template>
  <img
    class="cytoid-avatar"
    :src="avatarSrc"
    :style="fixed && { height: size + 'px', width: size + 'px' }"
    alt="avatar"
  >
</template>

<script>
const URL = process.server ? require('url').URL : window.URL
const defaultAvatarURL = 'https://artifacts.cytoid.io/avatar.jpg'
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
      const url = new URL(this.src, process.env.webURL)
      const size = this.size || 256
      if (url.host.includes('gravatar')) {
        // Served from Gravatar
        url.searchParams.append('s', size)
        url.searchParams.append('d', defaultAvatarURL)
      } else if (url.host === process.env.imagesURL) {
        // Served from images.cytoid.io
        url.searchParams.set('w', size)
        url.searchParams.set('h', size)
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
