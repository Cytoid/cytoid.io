import { createI18n } from 'vue-i18n'
import en from '~/locale/en'

type MessageSchema = typeof en

export default defineNuxtPlugin((nuxtApp) => {
  const vueApp = nuxtApp.vueApp
  const i18n = createI18n<[MessageSchema], 'en'>({
    legacy: false,
    globalInjection: true,
    fallbackLocale: 'en',
    messages: {
      en,
    },
  })

  vueApp.use(i18n)
})
