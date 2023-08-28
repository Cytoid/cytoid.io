import zhCN from './zh-CN/index.js'
import zhTW from './zh-TW/index.js'
import zhFJ from './zh-FJ/index.js'
import en from './en/index.js'
import ptBR from './pt-BR/index.js'
import viVN from './vi-VN/index.js'
import thTH from './th-TH/index.js'
import jaJP from './ja-JP/index.js'
import idID from './id-ID/index.js'
import esES from './es-ES/index.js'
import csCZ from './cs-CZ/index.js'
import koKR from './ko-KR/index.js'
import deDE from './de-DE/index.js'
import huHU from './hu-HU/index.js'
import ruRU from './ru-RU/index.js'

const locale: LocaleContent = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'zh-FJ': zhFJ,
  en,
  'pt-BR': ptBR,
  'vi-VN': viVN,
  'th-TH': thTH,
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'cs-CZ': csCZ,
  'id-ID': idID,
  'es-ES': esES,
  'hu-HU': huHU,
  'de-DE': deDE,
  'ru-RU': ruRU,

  // Bug: vue i18n ignored the final language so it is a dirty fix
  'zz': {
    general: {
      self: 'Hi, tell Teages if you can see it',
    },
  },
}
export default locale

interface LocaleContent {
  [key: string]: string | LocaleContent
}
