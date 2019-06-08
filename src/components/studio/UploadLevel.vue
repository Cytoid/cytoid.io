<template lang="pug">
a-upload-dragger(
  supportServerRender
  accept=".cytoidlevel"
  :customRequest="upload"
  :remove="removeUploadedFile"
  @change="uploadStatusChanged"
)
  p.ant-upload-drag-icon
    a-icon(type="inbox")
  p.ant-upload-text Click or drag your .cytoidlevel to this area
  p.ant-upload-hint Some other descriptions
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
