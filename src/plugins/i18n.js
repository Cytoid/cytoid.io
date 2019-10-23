import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import { formatDistanceToNow, parseISO, formatRelative } from 'date-fns'
import { pickLanguage, dateLocales } from '@/utils/i18n'

function countryRedirect(app, country) {
  return import('ant-design-vue/lib/notification')
    .then((a) => {
      const notification = a.default
      const t = app.i18n.t.bind(app.i18n)
      notification.warning({
        message: t('region_unavailable'),
        description: h => h('p', [
          t('region_unavailable_content'),
          h('a', {
            attrs: { href: 'https://cytoid.cn' },
          }, [h('a-button', { props: { type: 'danger', block: true } }, 'Visit Cytoid.cn')])
        ]),
        duration: 0,
        icon: h => h('font-awesome-icon', {
          props: { icon: 'chimney' },
        })
      })
    })
}

export default function ({ app, store, req }) {
  Vue.use(VueI18n)

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
    /*
    console.log('Country: ' + store.state.country)
    if (store.state.country === 'CN') {
      countryRedirect(app, store.state.country)
    }
    */
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

    // Set country code
    store.commit('setCountry', req.ctx.get('CF-IPCountry') || null)
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
