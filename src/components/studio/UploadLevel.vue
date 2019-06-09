<template lang="pug">
a-upload-dragger(
  supportServerRender
  accept=".cytoidlevel"
  :customRequest="upload"
  :remove="removeUploadedFile"
  @change="uploadStatusChanged"
)
  font-awesome-icon(:icon="['fas', 'upload']" fixed-width style="font-size: 32px; margin-top: 16px; margin-bottom: 16px;")
  p.ant-upload-text(style="font-weight: bold;") Click or drag a Cytoid level to this area
  p.ant-upload-hint(style="color: rgba(255, 255, 255, 0.3);") Don't know how to create one? Read our
    a(href="https://github.com/Cytoid/Cytoid/wiki/a.-Creating-a-level")  wiki
    span !
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    status: false,
  }),
  methods: {
    upload(option) {
      const source = axios.CancelToken.source()
      let uploadConfig = null
      this.$captcha('upload')
        .then(token => this.$axios.post('/files/packages', { token }, {
          cancelToken: source.token,
        }))
        .then((response) => {
          uploadConfig = response.data
          return axios.put(uploadConfig.uploadURL, option.file, {
            withCredentials: option.withCredentials,
            headers: {
              'Content-Type': 'application/zip'
            },
            cancelToken: source.token,
            onUploadProgress(e) {
              if (e.total > 0) {
                e.percent = (e.loaded / e.total) * 100
              }
              option.onProgress(e)
            }
          })
        })
        .then(() => {
          return this.$axios.post('/files/' + uploadConfig.path, {}, {
            cancelToken: source.token,
          })
        })
        .then((response) => {
          const details = response.data
          option.onSuccess(details)
        })
        .catch((error) => {
          option.onError(error, error.response?.data)
        })

      return {
        abort() {
          source.cancel()
        }
      }
    },
    removeUploadedFile() {
      // TODO: request to remove the file from the server
    },
    uploadStatusChanged({ file }) {
      this.status = file.status === 'done'
    }
  },
}
</script>

<style lang="less">
.ant-upload.ant-upload-drag {
  transition: 0.4s @hoverEasing;
  border: none;
  background-color: #FF3CAC;
  background-image: linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%);
  box-shadow: 0 0 0 0 hsla(226, 68%, 67%, 0.5);
  &:hover {
    transition: 0.4s @hoverEasing;
    box-shadow: 0 0 0 2px hsla(226, 68%, 67%, 0.5);
  }
}
</style>
