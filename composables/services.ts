import type { UseFetchOptions } from 'nuxt/app'
import { defu } from 'defu'

export function useServiceFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiURL
  const defaults: UseFetchOptions<T> = {
    baseURL,
  }
  const params = defu(options, defaults)
  return useFetch(url, params)
}

export function useServiceUrl(url: string) {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiURL
  return `${baseURL}${url}`
}

export function avatarURL(userId?: string, size?: number) {
  if (userId === null)
    return 'https://artifacts.cytoid.io/avatar.jpg'

  let url = useServiceUrl(`/users/${userId}/avatar`)
  if (size)
    url += `?size=${size}`

  return url
}
