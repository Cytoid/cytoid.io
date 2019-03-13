<template lang="pug">
  b-upload#level-upload(@input="levelFile" drag-drop accept=".cytoidlevel" :loading="loading && (uploadProgress === null)" :disabled="loading || (uploadProgress !== null)")
    #upload-hint(v-if="!loading")
      b-icon(icon="upload" size="is-large")
      p Drop your .cytoidlevel file here or click to upload
    //- The placeholder
    div#loading-container(v-else)
    progress.progress.is-primary#upload-progress(v-if="uploadProgress" :value="uploadProgress" max="1")
    #upload-state.has-text-grey(v-if="loading && uploadState" v-text="uploadState")
</template>

<script>
import axios from 'axios'
export default {
  name: 'LevelUpload',
  data() {
    return {
      uploadProgress: null,
      loading: false,
      uploadState: null
    }
  },
  methods: {
    async levelFile(newFile) {
      this.loading = true
      if (!newFile) {
        return
      }
      this.uploadState = 'Asking for permission...'
      const uploadInfo = await this.$axios.post('/levels/packages').then(res => res.data)
      this.uploadState = 'Preparing to upload...'
      await axios.put(uploadInfo.uploadURL, newFile, {
        headers: {
          'Content-Type': 'application/zip',
        },
        onUploadProgress: (progressEvent) => {
          this.uploadProgress = progressEvent.loaded / progressEvent.total
          this.uploadState = `Uploading (${Math.round(this.uploadProgress * 100)}%)`
        }
      })
      this.uploadState = 'Unpacking...'
      this.uploadProgress = null
      await this.$axios.post('/levels/packages', { key: uploadInfo.key })
        .then((details) => {
          this.$toast.open({
            message: 'Upload Succeed',
            type: 'is-success'
          })
        })
        .catch((error) => {
          this.$toast.open({
            message: 'Failed during unpacking: ' +
              (error.response
                ? (error.response.data.message || 'Unknown Error')
                : 'Network Error'),
            type: 'is-danger'
          })
        })
      this.loading = false
      this.uploadState = null
    }
  }
}
</script>

<style>
#loading-container {
  height: calc(50% - 1.5rem);
}
#upload-progress.progress  {
  top: 1rem;
  position: relative;
  left: 10%;
  width: 80%;
  margin: 0;
}
#upload-progress.progress::-webkit-progress-value {
  transition: width 0.5s ease;
}
#upload-hint {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
#upload-state {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 25%;
}
.upload .upload-draggable {
  position: relative;
  display: block;
}
</style>
