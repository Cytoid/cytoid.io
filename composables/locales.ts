import { formatDistanceToNow, parseISO, formatRelative } from 'date-fns'
//@ts-ignore
import { enUS, zhCN, zhTW, ptBR, th, vi, ja, es, id, cs, de, hu, ko } from 'date-fns/locale/index.js'
// ^ use this because https://github.com/date-fns/date-fns/issues/2629
// import { enUS, zhCN, zhTW, ptBR, th, vi, ja, es, id, cs, de, hu, ko } from 'date-fns/locale'
// ^ TODO: back to this after https://github.com/date-fns/date-fns/pull/3099


export const useLocales = () => {
  const { availableLocales, locale, setLocale: i18nSetLocale } = useI18n()
  
  availableLocales.splice(availableLocales.indexOf('default'), 1)
  
  const cookie = useSavedCookie('locale')

  
  const _ready = useState(() => false)
  const ready = computed<boolean>(() => _ready.value)

  const init = () => {
    if (ready.value) {
      return      
    }
    const headers = useRequestHeaders(['accept-language'])
    const { availableLocales, setLocale, localeCookie } = useLocales()
    if (localeCookie.value) {
      // Something debug
      return
    } else {
      // auto lang
      const acceptLang = headers['accept-language']
      if (acceptLang) {
        let acceptLangs = acceptLang.split(',')
        let acceptLangList = acceptLangs.map((lang) => {
          let [name, langQ] = lang.split(';')
          let q = langQ ? parseFloat(langQ.split('=')[1]) : 1
          let langM = { name, q }
          return langM
        }).sort((a, b) => b.q - a.q)
        for (let lang of acceptLangList) {
          for (let availableLang of availableLocales) {
            if (lang.name.toLowerCase() == availableLang.toLowerCase()) {
              setLocale(lang.name)
              return
            }
          }
        }
      }
    }
  }
  
  const setLocale = (code:string) => {
    cookie.value = code
    i18nSetLocale(code)
    useHead({
      htmlAttrs:{
        lang: code
        // lang: code
      }
    })
  }
  
  i18nSetLocale(cookie.value || 'en')
  useHead({
    htmlAttrs:{
      lang: cookie.value || 'en'
    }
  })

  return { availableLocales, locale, setLocale, localeCookie: cookie, init }
}

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

export function dateFromNow (dateStr:string) {
  const locale = useLocales().locale.value
  return formatDistanceToNow(
    parseISO(dateStr),
    {
      addSuffix: true,
      // @ts-ignore
      locale: dateLocales[locale]
    }
  )
}
export function dateFormatCalendar (dateStr:string, from = new Date()) {
  const locale = useLocales().locale.value
  return formatRelative(
    parseISO(dateStr),
    from,
    {
      // @ts-ignore
      locale: dateLocales[locale]
    }
  )
}