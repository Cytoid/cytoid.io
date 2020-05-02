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
  methods: {
    execute() {
      return new Promise((resolve, reject) => {
        this.executeResolve = resolve
        this.executeReject = reject
        this.$refs.captcha.execute()
      })
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
          verify: (code) => {
            if (this.executeResolve) {
              this.executeResolve(code)
              this.executeResolve = null
              this.executeReject = null
            }
            this.$emit('input', code)
          },
          expired: () => this.$emit('input', null),
          error: () => {
            if (this.executeReject) {
              this.executeReject(new Error('Captcha verification failed'))
              this.executeReject = null
              this.executeResolve = null
            }
            this.$emit('input', null)
          },
        },
        ref: 'captcha'
      }
    )
  }
}
