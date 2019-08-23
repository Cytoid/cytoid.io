import { pick } from 'accept-language-parser'

import { enUS, zhCN, zhTW } from 'date-fns/locale'

export const supportedLanguages = Object.freeze({
  en: 'English',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
})

export const dateLocales = Object.freeze({
  en: enUS,
  'zh-cn': zhCN,
  'zh-tw': zhTW,
})

export function pickLanguage(headerStr) {
  return pick(Object.keys(supportedLanguages), headerStr)
}
