import Hcaptcha from '@hcaptcha/vue-hcaptcha/src/component/vue-hcaptcha.vue'
export default {
  name: 'Captcha',
  components: {
    Hcaptcha,
  },
  props: {
    size: {
      type: String,
      required: false,
      default: 'normal', // normal, compact, invisible
    },
    value: {
      type: String,
      required: false,
    }
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.$refs.captcha.reset()
      }
    }
  },
  render(h) {
    return h(
      'hcaptcha',
      {
        props: {
          sitekey: process.env.captchaKey,
          size: this.size,
          theme: 'dark',
        },
        on: {
          verify: code => this.$emit('input', code),
          expired: () => this.$emit('input', null),
          error: () => this.$emit('input', null),
        },
        ref: 'captcha'
      }
    )
  }
}
