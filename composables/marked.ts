import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export function useSafeMarked(safeMdText: string) {
  marked.use({
    async: false,
  })
  return marked.parse(safeMdText) as string
}

export function useMarkedWithCleaner(mdText: string) {
  return sanitizeHtml(useSafeMarked(mdText), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'details',
      'summary',
      'del',
    ]),
  })
}

export const useMarked = useMarkedWithCleaner
