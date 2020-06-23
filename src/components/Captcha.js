function CaptchaScript(cb) {
  const script = document.createElement('script')
  script.src = 'https://www.google.com/recaptcha/api.js'
  if (cb) {
    script.src += '?onload=grecaptchaOnload'
    global.grecaptchaOnload = cb
  }
  script.async = true
  script.defer = true
  return script
}

export default {
  name: 'Captcha',
  mounted() {
    // if not loaded, create script tag, and wait to render hcaptcha element
    if (!global.grecaptcha) {
      console.log('loading captcha js')
      const script = CaptchaScript(this.renderCaptcha)
      if (document.getElementsByTagName('head').length > 0) {
        const container = document.getElementsByTagName('head')[0]
        container.appendChild(script)
      }
    } else {
      console.log('captcha already loaded')
      this.renderCaptcha()
    }
  },
  methods: {
    renderCaptcha() {
      global.grecaptcha.render(this.$el, {
        sitekey: process.env.captchaKey,
        badge: 'bottomleft',
        size: 'invisible',
        callback: this.onSubmit,
        'expired-callback': this.onExpired,
        'error-callback': this.onError,
      })
    },
    execute() {
      if (typeof global.grecaptcha === 'undefined') {
        return Promise.reject(new Error(this.$t('captcha_not_loaded')))
      }
      global.grecaptcha.execute()

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    onSubmit(token) {
      if (this.resolve) {
        this.resolve(token)
        this.resolve = null
        this.reject = null
      }
      global.grecaptcha.reset()
    },
    onExpired() {
      if (this.reject) {
        this.reject(new Error('token expired'))
        this.resolve = null
        this.reject = null
      }
      global.grecaptcha.reset()
    },
    onError() {
      if (this.reject) {
        this.reject(new Error('Can not load reCAPTCHA'))
        this.resolve = null
        this.reject = null
      }
    }
  },
  render(h) {
    return h('div')
  }
}
