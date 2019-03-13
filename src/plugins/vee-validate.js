import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate, {
  inject: true,
  validity: true,
  aria: true,
})

const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])/

VeeValidate.Validator.extend('password', {
  getMessage(field) {
    return `The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character.`
  },
  validate(value) {
    return strongRegex.test(value)
  }
})
