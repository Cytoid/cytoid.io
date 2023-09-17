import { createI18n } from 'vue-i18n'
import en from '~/locale/en'
import zhCN from '~/locale/zh-CN'
import zhTW from '~/locale/zh-TW'
import zhFJ from '~/locale/zh-FJ'
import csCZ from '~/locale/cs-CZ'
import deDE from '~/locale/de-DE'
import esES from '~/locale/es-ES'
import ptBR from '~/locale/pt-BR'
import viVN from '~/locale/vi-VN'
import tlPH from '~/locale/tl-PH'
import thTH from '~/locale/th-TH'
import jaJP from '~/locale/ja-JP'
import koKR from '~/locale/ko-KR'
import idID from '~/locale/id-ID'
import frFR from '~/locale/fr-FR'
import huHU from '~/locale/hu-HU'
import msMY from '~/locale/ms-MY'
import ruRU from '~/locale/ru-RU'

type MessageSchema = typeof en

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n<[MessageSchema], (
    'en' |
    'zh-CN' |
    'zh-TW' |
    'zh-FJ' |
    'cs-CZ' |
    'de-DE' |
    'es-ES' |
    'pt-BR' |
    'vi-VN' |
    'tl-PH' |
    'th-TH' |
    'ja-JP' |
    'ko-KR' |
    'id-ID' |
    'fr-FR' |
    'hu-HU' |
    'ms-MY' |
    'ru-RU'
  )>({
      legacy: false,
      globalInjection: true,
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en,
        'zh-CN': zhCN,
        'zh-TW': zhTW,
        'zh-FJ': zhFJ,
        'cs-CZ': csCZ,
        'de-DE': deDE,
        'es-ES': esES,
        'pt-BR': ptBR,
        'vi-VN': viVN,
        'tl-PH': tlPH,
        'th-TH': thTH,
        'ja-JP': jaJP,
        'ko-KR': koKR,
        'id-ID': idID,
        'fr-FR': frFR,
        'hu-HU': huHU,
        'ms-MY': msMY,
        'ru-RU': ruRU,

      },
    })

  vueApp.use(i18n)
})
