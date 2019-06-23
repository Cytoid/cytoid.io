import axios from 'axios'
const uploadMixin = (type, contentType) => ({
  methods: {
    upload(option) {
      const source = axios.CancelToken.source()
      this.$captcha('upload')
        .then(token => this.$axios.post('/files/' + type, { token }, {
          cancelToken: source.token,
        }))
        .then(response => axios.put(response.data.uploadURL, option.file, {
          withCredentials: option.withCredentials,
          headers: {
            'Content-Type': contentType,
          },
          cancelToken: source.token,
          onUploadProgress(e) {
            if (e.total > 0) {
              e.percent = (e.loaded / e.total) * 100
            }
            option.onProgress(e)
          }
        })
          .then(() => this.$axios.post('/files/' + response.data.path, {}, {
            cancelToken: source.token,
          }))
        )
        .then((response) => {
          const details = response.data
          option.onSuccess(details)
        })
        .catch((error) => {
          option.onError(error, error.response?.data)
        })

      return {
        abort: source.cancel
      }
    },
  }
})

export default uploadMixin
