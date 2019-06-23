import axios from 'axios'
export default {
  methods: {
    upload(option) {
      const source = axios.CancelToken.source()
      this.$captcha('upload')
        .then(token => this.$axios.post('/files/' + this.type, { token }, {
          cancelToken: source.token,
        }))
        .then(response => axios.put(response.data.uploadURL, option.file, {
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
}
