import Vue from 'vue'

const component = {
  render(h) {
    return h('div')
  },
  props: {
    theme: {
      type: String,
      default: 'light',
      validator: value => value === 'light' || value === 'dark',
    },
    badge: {
      type: String,
      default: 'inline',
      validator: value => ['bottomright', 'bottomleft', 'inline'].includes(value),
    },
    invisible: {
      type: Boolean,
      default: false,
    }
  },
  mounted() {
    this.$emit('update:token', 'fuckcensorship')
  },
}

export default function (_, inject) {
  Vue.component('captcha', component)
}
