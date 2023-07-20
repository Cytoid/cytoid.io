import { formatDistanceToNow, formatRelative, parseISO } from 'date-fns'

// @ts-expect-error https://github.com/date-fns/date-fns/issues/2629
import { cs, de, enUS, es, hu, id, ja, ko, ptBR, th, vi, zhCN, zhTW } from 'date-fns/locale/index.js'

// import { enUS, zhCN, zhTW, ptBR, th, vi, ja, es, id, cs, de, hu, ko } from 'date-fns/locale'
// ^ TODO: back to this after https://github.com/date-fns/date-fns/pull/3099

export function useLocales() {
  const { availableLocales, locale, setLocale: i18nSetLocale } = useI18n()

  availableLocales.splice(availableLocales.indexOf('default'), 1)

  const cookie = useSavedCookie('locale')

  const _ready = useState(() => false)
  const ready = computed<boolean>(() => _ready.value)

  const setLocale = (code: string) => {
    cookie.value = code
    i18nSetLocale(code)
    useHead({
      htmlAttrs: {
        lang: code,
        // lang: code
      },
    })
  }

  i18nSetLocale(cookie.value || 'en')
  useHead({
    htmlAttrs: {
      lang: cookie.value || 'en',
    },
  })

  const init = (acceptLangHeader?: string) => {
    if (ready.value)
      return

    if (cookie.value)
      return

    if (!acceptLangHeader)
      return

    const acceptLangs = acceptLangHeader.split(',')
    const acceptLangList = acceptLangs.map((lang) => {
      const [name, langQ] = lang.split(';')
      const q = langQ ? Number.parseFloat(langQ.split('=')[1]) : 1
      const langM = { name, q }
      return langM
    }).sort((a, b) => b.q - a.q)
    for (const lang of acceptLangList) {
      for (const availableLang of availableLocales) {
        if (lang.name.toLowerCase() === availableLang.toLowerCase()) {
          setLocale(lang.name)
          return
        }
      }
    }
  }

  return { availableLocales, locale, setLocale, localeCookie: cookie, init }
}

export const dateLocales = Object.freeze({
  'en': enUS,
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

export function dateFromNow(dateStr: string) {
  const locale = useLocales().locale.value
  return formatDistanceToNow(
    parseISO(dateStr),
    {
      addSuffix: true,
      // @ts-expect-error that is codegen so ignore any
      locale: dateLocales[locale],
    },
  )
}
export function dateFormatCalendar(dateStr: string, from = new Date()) {
  const locale = useLocales().locale.value
  return formatRelative(
    parseISO(dateStr),
    from,
    {
      // @ts-expect-error that is codegen so ignore any
      locale: dateLocales[locale],
    },
  )
}
