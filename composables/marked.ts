import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export function useSafeMarked(safeMdText: string) {
  marked.use({})
  return marked.parse(safeMdText)
}

export function useMarkedWithCleaner(mdText: string) {
  return sanitizeHtml(useSafeMarked(mdText), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'details',
      'summary',
    ]),
  })
}

export const useMarked = useMarkedWithCleaner
