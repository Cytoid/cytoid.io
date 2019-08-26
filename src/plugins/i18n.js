import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import { formatDistanceToNow, parseISO, formatRelative } from 'date-fns'
import axios from 'axios'
import { pickLanguage, dateLocales } from '@/utils/i18n'

export default function ({ app, store, req }) {
  Vue.use(VueI18n)

  axios.get('https://www.google.com/recaptcha/api2/reload', { timeout: 2000 })
    .catch((error) => {
      console.log(error.response.status)
      if (error.response && error.response.status === 405) {
        return
      }
      window.alert('// 公告\n\n十分抱歉，目前 CytoidIO 暂时不支持国内 IP 进行以下操作：\n\n    * 注册及登录（游戏内可以正常登录）\n    * 上传关卡。\n我们会在接下来数日尽快修复上述问题，以保证国内玩家的浏览体验。在此期间，建议您使用代理访问 CytoidIO。')
    })

  app.i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: require('@/locale/en/index.json'),
      'zh-cn': require('@/locale/zh-cn/index.json'),
      'zh-tw': require('@/locale/zh-tw/index.json'),
    }
  })
  if (process.client) {
    if (store.state.locale) {
      app.i18n.locale = store.state.locale
    } else if (Cookies.get('locale')) {
      store.commit('setLocale', Cookies.get('locale'))
    } else {
      const locale = pickLanguage(window.navigator.userLanguage || window.navigator.language)
      store.commit('setLocale', locale)
    }
  } else if (req) {
    const cookieLocale = req.ctx.cookies.get('locale', { signed: false })
    if (cookieLocale) {
      store.commit('setLocale', cookieLocale)
    } else if (req.headers['accept-language']) {
      const lang = pickLanguage(req.headers['accept-language'])
      store.commit('setLocale', lang)
      req.ctx.cookies.set('locale', lang, {
        signed: false,
        maxAge: 3600 * 24 * 15, // Cache locale data for 14 days,
        secure: false,
        httpOnly: false,
      })
    }
    let resposeLocaleCode = store.state.locale
    if (!resposeLocaleCode) {
      resposeLocaleCode = 'en'
    }
    if (resposeLocaleCode !== 'en') {
      resposeLocaleCode += ',en'
    }
    req.ctx.set('Content-Language', resposeLocaleCode)
  }

  Vue.mixin({
    methods: {
      $dateFromNow(dateStr) {
        return formatDistanceToNow(
          parseISO(dateStr),
          {
            addSuffix: true,
            locale: this.$dateLocale
          }
        )
      },
      $dateFormatCalendar(dateStr, from = new Date()) {
        return formatRelative(
          parseISO(dateStr),
          from,
          {
            locale: this.$dateLocale
          }
        )
      }
    },
    computed: {
      $dateLocale() {
        return dateLocales[this.$store.state.locale]
      },
    }
  })
}
