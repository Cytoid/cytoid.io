import { marked as _marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

function marked(raw: string): string {
  const md = _marked.use({
    async: false,
  })
  return md.parse(raw) as string
}

/**
 * @deprecated use trustedMarked
 */
export function useSafeMarked(safeMdText: string) {
  return sanitizeHtml(marked(safeMdText), {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
  })
}

/**
 * @deprecated use marked
 */
export function useMarkedWithCleaner(mdText: string) {
  return sanitizeHtml(marked(mdText), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'details',
      'summary',
      'del',
    ]),
  })
}

/**
 * @deprecated use marked
 */
export const useMarked = useMarkedWithCleaner
