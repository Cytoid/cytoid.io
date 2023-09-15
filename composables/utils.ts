import type { CookieOptions } from '#app'

export function copyToClipboard(text: string, name?: string) {
  const { copy, isSupported } = useClipboard()
  if (isSupported.value) {
    copy(text)
    successAlert(`Copied ${name || 'text'} to clipboard`)
  }
}

export function useSavedCookie<T = string>(name: string, _opts?: CookieOptions<T>) {
  return useCookie(name, {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    ..._opts,
  })
}

export function truncateNum(num: number, digits = 2) {
  return (Math.trunc(num * 10 ** digits) / 10 ** digits).toFixed(digits)
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
