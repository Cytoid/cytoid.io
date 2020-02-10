<template lang="pug">
  b-upload.upload-resource(
    @input="upload"
    drag-drop
    :accept="accept"
    :disabled="state !== null")
    captcha(invisible badge="bottomleft")
    .wrapper(:style="background && value && styles")
      section.section
        content.has-text-centered
          p
            font-awesome-icon(icon="upload" size="3x")
          p(v-if="state === null") Drop your files here or click to upload {{ this.state }}
          template(v-else)
            p(v-text="message")
            b-progress(:value="progress")
</template>

<script>
import axios from 'axios'
export default {
  props: {
    accept: {
      type: String,
      default: 'image/*'
    },
    type: {
      type: String,
      required: true,
    },
    background: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      file: null,
      state: null,
      progress: null,
    }
  },
  computed: {
    message() {
      return {
        SIGNURL: 'Authenticating the request',
        UPLOAD: 'Uploading the file',
        TOKEN: 'Verifying user identity',
        CALLBACK: 'Notifying the server about the new file',
        ERROR: 'Upload failed. Please try again.'
      }[this.state]
    },
    styles() {
      return {
        'background-image': `url("${
          this.$img(this.value, { height: 250 })
        }")`
      }
    }
  },
  methods: {
    upload(file) {
      const source = axios.CancelToken.source()
      this.state = 'TOKEN'
      this.$captcha('upload')
        .then((token) => {
          this.state = 'SIGNURL'
          return this.$axios.post('/files/' + this.type, { token }, {
            cancelToken: source.token,
          })
        })
        .then((res) => {
          this.state = 'UPLOAD'
          this.progress = 0
          return axios.put(res.data.uploadURL, file, {
            withCredentials: false,
            cancelToken: source.token,
            headers: {
              'Content-Type': this.accept,
            },
            onUploadProgress: (e) => {
              if (e.total > 0) {
                this.progress = (e.loaded / e.total) * 100
              }
            }
          })
            .then(() => {
              this.state = 'CALLBACK'
              this.progress = null
              return this.$axios.post(
                '/files/' + res.data.path,
                {},
                {
                  cancelToken: source.token,
                }
              )
            })
            .then(() => {
              this.$emit('input', res.data.path)
            })
        })
        .catch((error) => {
          const message = error.response?.data?.message || error.message
          this.$message.error(message)
        })
        .then(() => {
          this.state = null
          this.$captcha.reset()
        })
    }
  }
}
</script>

<style lang="scss">
.upload.control.upload-resource, .upload.control.upload-resource .upload-draggable {
  width: 100%;
  padding: 0;
  overflow: hidden;
}
.upload.control.upload-resource .wrapper {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  .section {
    background-color: rgba(0, 0, 0, .6);
  }
}
</style>
