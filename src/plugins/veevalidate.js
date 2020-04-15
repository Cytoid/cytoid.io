import Vue from 'vue'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

export default function ({ app, store, req, res }) {
  const i18n = app.i18n
  extend('email', email)
  extend('required', required)

  extend('password', {
    validate(password) {
      if (password.length < 9) {
        return i18n.t('password_requirement_length')
      }
      if (!/\w/g.test(password)) {
        return i18n.t('password_requirement_letter')
      }
      if (!/\d/g.test(password)) {
        return i18n.t('password_requirement_number')
      }
      return true
    },
  })

  extend('password_confirm', {
    params: ['target'],
    validate(value, { target }) {
      if (value === target) {
        return true
      } else {
        return i18n.t('password_confirmation_mismatch')
      }
    },
  })

  Vue.component('ValidationProvider', ValidationProvider)
  Vue.component('ValidationObserver', ValidationObserver)
}
