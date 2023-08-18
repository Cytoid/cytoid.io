import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export function useSafeMarked(safeMdText: string) {
  marked.use({
    mangle: false,
    headerIds: false,
  })
  return marked.parse(safeMdText)
}

export function useMarkedWithCleaner(mdText: string) {
  return sanitizeHtml(useSafeMarked(mdText), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
    ]),
  })
}

export const useMarked = useMarkedWithCleaner
