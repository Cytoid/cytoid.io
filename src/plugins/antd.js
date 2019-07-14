import Vue from 'vue'
import Antd from 'ant-design-vue/lib'
import Avatar from '@/components/Avatar'

function getMessage(err) {
  if (err.response?.status === 404) {
    return 'Resource Not Found'
  }
  return err.response?.data.message ||
    err.response?.data.name ||
    err.response?.data ||
    err.message || 'Unknown Error'
}

export function handleErrorBlock(err, handler) {
  return handler({
    statusCode: err.response?.status || 502,
    message: getMessage(err),
  })
}

export default function ({ store, $axios, error }) {
  Vue.use(Antd)
  Vue.component('avatar', Avatar)

  // Global error handlers
  Vue.mixin({
    methods: {
      handleErrorBlock(err) {
        return handleErrorBlock(err, error)
      },
      handleErrorToast(err) {
        this.$message.error(getMessage(err))
      }
    }
  })
}
