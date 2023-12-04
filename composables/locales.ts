import { useI18n } from 'vue-i18n'
import { formatDistanceToNow, formatRelative, parseISO } from 'date-fns'

// @ts-expect-error https://github.com/date-fns/date-fns/issues/2629
import { cs, de, enUS, es, hu, id, ja, ko, ptBR, th, vi, zhCN, zhTW } from 'date-fns/locale/index.js'

// import { enUS, zhCN, zhTW, ptBR, th, vi, ja, es, id, cs, de, hu, ko } from 'date-fns/locale'
// ^ TODO: back to this after https://github.com/date-fns/date-fns/pull/3099

export function useLocales() {
  const locales: Array<{ name: string, code: string, loaded?: boolean }> = [
    { name: 'Čeština', code: 'cs-CZ' },
    { name: 'Deutsch', code: 'de-DE' },
    { name: 'English', code: 'en' },
    { name: 'Inglés', code: 'es-ES' },
    { name: 'Português', code: 'pt-BR' },
    { name: 'Tiếng Việt', code: 'vi-VN' },
    { name: 'Tagalog', code: 'tl-PH' },
    { name: 'ภาษาไทย', code: 'th-TH' },
    { name: '日本語', code: 'ja-JP' },
    { name: '한국어', code: 'ko-KR' },
    { name: 'Bahasa Inggris', code: 'id-ID' },
    { name: 'Français', code: 'fr-FR' },
    { name: 'Angol', code: 'hu-HU' },
    { name: 'Malay', code: 'ms-MY' },
    { name: 'Russian', code: 'ru-RU' },
    { name: '中文（简体）', code: 'zh-CN' },
    { name: '中文（繁體）', code: 'zh-TW' },
    { name: '中文（符语）', code: 'zh-FJ' },
  ]

  const { locale: _locale, availableLocales: loadedLocales, t, setLocaleMessage } = useI18n()
  const setLocaleWithoutSave = async (code: string) => {
    // lazy load
    if (locales.find(l => l.code === code && !l.loaded)) {
      const m = await import(`../locale/${code}/index.ts`)
      setLocaleMessage(code, m.default)
      locales.find(l => l.code === code)!.loaded = true
    }
    _locale.value = code
  }

  const cookie = useSavedCookie('locale')

  const _ready = useState(() => false)
  const ready = computed<boolean>(() => _ready.value)

  const setLocale = async (code: string) => {
    cookie.value = code
    useHead({
      htmlAttrs: {
        lang: code,
        // lang: code
      },
    })
    await setLocaleWithoutSave(code)
  }

  useHead({
    htmlAttrs: {
      lang: cookie.value || 'en',
    },
  })

  const init = async (acceptLangHeader?: string) => {
    if (ready.value) {
      return
    }

    if (cookie.value) {
      await setLocaleWithoutSave(cookie.value)
      return
    }

    if (process.client || !acceptLangHeader) {
      return
    }

    // no cookies, auto load language
    const acceptLangs = acceptLangHeader.split(',')
    const acceptLangList = acceptLangs.map((lang) => {
      const [name, langQ] = lang.split(';')
      const q = langQ ? Number.parseFloat(langQ.split('=')[1]) : 1
      const langM = { code: name, q }
      return langM
    }).sort((a, b) => b.q - a.q)
    for (const lang of acceptLangList) {
      for (const available of locales) {
        if (lang.code.toLowerCase() === available.code.toLowerCase()) {
          await setLocale(lang.code)
          return
        }
      }
    }
  }

  const locale = computed({
    get: () => _locale.value,
    set: async (code: string) => {
      await setLocale(code)
    },
  })

  return { t, loadedLocales, locales, locale, setLocale, localeCookie: cookie, init }
}

// date-fns
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
