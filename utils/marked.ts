import { marked as asyncMarked } from 'marked'
import sanitizeHtml from 'sanitize-html'

function syncMarked(raw: string): string {
  const md = asyncMarked.use({
    async: false,
  })
  return md.parse(raw) as string
}

export function marked(raw: string): string {
  return sanitizeHtml(syncMarked(raw), {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'details',
      'summary',
      'del',
    ]),
  })
}

export function trustedMarked(trusted: string): string {
  return sanitizeHtml(syncMarked(trusted), {
    allowedTags: false,
    allowedAttributes: false,
    allowVulnerableTags: true,
  })
}
