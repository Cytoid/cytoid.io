import { pick } from 'accept-language-parser'

import 'moment/locale/zh-cn'
import 'moment/locale/zh-tw'

export const supportedLanguages = Object.freeze({
  en: 'English',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
})

export function pickLanguage(headerStr) {
  return pick(Object.keys(supportedLanguages), headerStr)
}
