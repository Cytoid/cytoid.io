<template lang="pug">
a-row(type="flex" justify="center" align="middle")
  a-col(:span="12")
    a-upload-dragger(
      supportServerRender
      accept=".cytoidlevel"
      :action="getUploadURL"
      :customRequest="upload"
      :headers="{ 'Content-Type': 'application/zip' }"
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
const CancelToken = axios.CancelToken
const source = CancelToken.source()
function upload(option) {
  axios.put(option.action, option.file, {
    withCredentials: option.withCredentials,
    headers: option.headers || {},
    cancelToken: source.token,
    onUploadProgress(e) {
      if (e.total > 0) {
        e.percent = (e.loaded / e.total) * 100
      }
      option.onProgress(e)
    }
  })
    .then((response) => {
      option.onSuccess(response.data)
    })
    .catch((error) => {
      option.onError(error, error.response?.data)
    })

  return {
    abort() {
      source.cancel()
    }
  }
}

export default {
  data: () => ({
    status: false,
  }),
  computed: {
    upload: () => upload,
  },
  methods: {
    getUploadURL() {
      if (this.cachedUploadInfo) {
        return this.cachedUploadInfo.uploadURL
      }
      return this.$axios.post('/levels/packages')
        .then((response) => {
          this.cachedUploadInfo = response.data
          return this.cachedUploadInfo.uploadURL
        })
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
