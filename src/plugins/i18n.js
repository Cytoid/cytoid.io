import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { formatDistanceToNow, parseISO, formatRelative } from 'date-fns'
import { pick } from 'accept-language-parser'
import { enUS, zhCN, zhTW, ptBR, th, vi, ja, es, id, cs, de, hu, ko } from 'date-fns/locale'
import locales from '@/locale'

export const supportedLanguages = [
  'en',
  'zh-CN',
  'zh-TW',
  'zh-FJ',
  'pt-BR',
  'es-ES',
  'de-DE',
  'vi-VN',
  'th-TH',
  'ja-JP',
  'ko-KR',
  'id-ID',
  'cs-CZ',
  'hu-HU',
]

export const dateLocales = Object.freeze({
  en: enUS,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'zh-FJ': zhCN,
  'pt-BR': ptBR,
  'th-TH': th,
  'vi-VN': vi,
  'es-ES': es,
  'ja-JP': ja,
  'id-ID': id,
  'cs-CZ': cs,
  'ko-KR': ko,
  'de-DE': de,
  'hu-HU': hu,
})

export function pickLanguage (headerStr) {
  return pick(supportedLanguages, headerStr)
}
export default function ({ app, store, req, res }) {
  Vue.use(VueI18n)

  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    sync: true,
    messages: supportedLanguages.reduce((result, item) => {
      result[item] = locales[item].default
      return result
    }, {})
  })
  if (process.client) {
    if (store.state.locale) {
      app.i18n.locale = store.state.locale
    } else {
      const locale = pickLanguage(window.navigator.userLanguage || window.navigator.language)
      if (locale) {
        store.commit('setLocale', locale)
      }
    }
    console.log('Country: ' + store.state.country)
  } else if (req) {
    if (req.cookies.locale) {
      store.commit('setLocale', req.cookies.locale)
    } else if (req.headers['accept-language']) {
      const lang = pickLanguage(req.headers['accept-language'])
      if (lang) {
        store.commit('setLocale', lang)
      }
    }
    let resposeLocaleCode = store.state.locale
    if (!resposeLocaleCode) {
      resposeLocaleCode = 'en'
    }
    if (resposeLocaleCode !== 'en') {
      resposeLocaleCode += ',en'
    }
    res.set('Content-Language', resposeLocaleCode)

    // Set country code
    store.commit('setCountry', req.get('CF-IPCountry') || null)
  }
}

Vue.mixin({
  beforeCreate () {
    const key = this.$options.i18n && this.$options.i18n.key
    if (!key) {
      return
    }
    const componentLocales = {}
    for (const lang in locales) {
      componentLocales[lang] = locales[lang][key]
    }
    this.$options.i18n.messages = componentLocales
  },
  methods: {
    $dateFromNow (dateStr) {
      return formatDistanceToNow(
        parseISO(dateStr),
        {
          addSuffix: true,
          locale: dateLocales[this.$store.state.locale]
        }
      )
    },
    $dateFormatCalendar (dateStr, from = new Date()) {
      return formatRelative(
        parseISO(dateStr),
        from,
        {
          locale: dateLocales[this.$store.state.locale]
        }
      )
    }
  }
})
