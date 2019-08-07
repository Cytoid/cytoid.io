import { pick } from 'accept-language-parser'

export const supportedLanguages = Object.freeze({
  en: 'English',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
})

export function pickLanguage(headerStr) {
  return pick(Object.keys(supportedLanguages), headerStr)
}
