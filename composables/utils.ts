import sanitizeHtml from 'sanitize-html'
import type { CookieOptions } from '#app'

export function useSavedCookie<T = string>(name: string, _opts?: CookieOptions<T>) {
  return useCookie(name, {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    ..._opts,
  })
}

export function wait(sec: number = 0.001) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

export function formatBytes(bytes: number) {
  if ((bytes >> 30) & 0x3FF) {
    return `${bytes >>> 30
      }.${(bytes & (3 * 0x3FF)).toString().substring(0, 2)} GB`
  }
  else if ((bytes >> 20) & 0x3FF) {
    return `${bytes >>> 20
      }.${(bytes & (2 * 0x3FF)).toString().substring(0, 2)} MB`
  }
  else if ((bytes >> 10) & 0x3FF) {
    return `${bytes >>> 10
      }.${(bytes & (0x3FF)).toString().substring(0, 2)} KB`
  }
  else if ((bytes >> 1) & 0x3FF) {
    return `${bytes >>> 1
      } Bytes`
  }
  else { return `${bytes} Byte` }
}

export class Meta {
  meta: { hid: string; name: string; content: string }[]
  title: string
  constructor(title: string, description: string, verb = null) {
    let markedDescription = sanitizeHtml(useMarked(description), { allowedTags: [] })
    if (markedDescription.length > 100) {
      markedDescription = markedDescription.substring(0, 100)
    }

    this.title = title
    if (verb) {
      this.title = `${verb} ${this.title}`
    }

    this.meta = [
      { hid: 'description', name: 'description', content: markedDescription },
      { hid: 'og:description', name: 'og:description', content: markedDescription },
      { hid: 'name', name: 'name', content: title },
      { hid: 'og:title', name: 'og:title', content: title },
    ]
  }

  extend(id: string, content?: string | null) {
    if (!content) {
      return
    }
    this.meta.push({
      hid: id,
      name: id,
      content,
    })
  }
}
