import locale from './locale'

export default defineI18nConfig(() => {
  return {
    legacy: false,
    locale: 'en',
    messages: locale
  }
})
