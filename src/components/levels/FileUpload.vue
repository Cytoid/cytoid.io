<template lang="pug">
  b-upload(v-model="levelFile" drag-drop accept=".cytoidlevel")
    .section: .content.has-text-centered
      b-icon(icon="upload" size="is-large")
      p Drop your files here or click to upload
      progress.progress.is-small(v-if="uploadProgress" :value="uploadProgress" max="1")
</template>

<script>
import axios from 'axios'
export default {
  name: 'FileUpload',
  data() {
    return {
      levelFile: null,
      uploadProgress: null,
    }
  },
  watch: {
    async levelFile(newFile) {
      if (!newFile) {
        return
      }
      const uploadInfo = await this.$axios.post('/levels/packages').then(res => res.data)
      await axios.put(uploadInfo.uploadURL, newFile, {
        headers: {
          'Content-Type': 'application/zip',
        },
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = progressEvent.loaded / progressEvent.total
        }
      })
      await this.$axios.post('/levels/packages', { key: uploadInfo.key })
    }
  }
}
</script>

<style scoped>

</style>
