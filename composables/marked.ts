import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html';

export const useSafeMarked = (safeMdText:string) => {
  marked.use({
    mangle: false,
    headerIds: false
  })
  return marked.parse(safeMdText)
}

export const useMarkedWithCleaner = (mdText:string) => {
  return sanitizeHtml(useSafeMarked(mdText))
}

export const useMarked = useMarkedWithCleaner