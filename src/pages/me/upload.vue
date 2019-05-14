<template lang="pug">
a-row(type="flex" justify="center" align="middle")
  a-col(:span="12")
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
  a-button(v-if="status") Next
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    status: false,
  }),
  mounted() {
  },
  methods: {
    upload(option) {
      const source = axios.CancelToken.source()
      let uploadConfig = null
      this.$axios.post('/levels/packages', {}, {
        cancelToken: source.token,
      })
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
          return this.$axios.post('/levels/packages', { key: uploadConfig.key }, {
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

<style scoped>

</style>
