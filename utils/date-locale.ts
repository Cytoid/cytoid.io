import { formatDistanceToNow, formatRelative, parseISO } from 'date-fns'

import { cs, de, enUS, es, fr, hu, id, ja, ko, ms, ptBR, ru, th, vi, zhCN, zhTW } from 'date-fns/locale'

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
  'fr-FR': fr,
  'ms-MY': ms,
  'ru-RU': ru,

  'tl-PH': enUS,
})

export function dateFromNow(dateStr: string) {
  const locale = useLocales().locale.value
  return formatDistanceToNow(
    parseISO(dateStr),
    {
      addSuffix: true,
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
      locale: dateLocales[locale],
    },
  )
}
