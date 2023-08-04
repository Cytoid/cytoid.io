// Thanks to https://github.com/gbicou/nuxt3-urql/blob/main/plugins/urql.ts but with some modifications.
import type { Client, SSRData } from '@urql/core'
import { cacheExchange, createClient, fetchExchange, ssrExchange } from '@urql/core'

const ssrKey = '__URQL_DATA__'

export default defineNuxtPlugin((nuxt) => {
  const { vueApp } = nuxt

  const config = useRuntimeConfig()
  const url = config.public.graphqlURL

  const ssr = ssrExchange({
    isClient: process.client,
  })

  if (process.client) {
    // when app is created in browser, restore SSR state from nuxt payload
    nuxt.hook('app:created', () => {
      ssr.restoreData(nuxt.payload[ssrKey] as SSRData)
    })
  }

  if (process.server) {
    // when app has rendered in server, send SSR state to client
    nuxt.hook('app:rendered', () => {
      nuxt.payload[ssrKey] = ssr.extractData()
    })
  }

  const client = createClient({
    url,
    exchanges: [
      cacheExchange,
      fetchExchange,
    ],
    fetchOptions: () => {
      const cookie = process.client ? document.cookie : cookieFiLter(['cyt:sess'])
      return {
        headers: {
          cookie,
        },
      }
    },
  })

  nuxt.provide('urql', client)
  vueApp.provide('$urql', client)
})

function cookieFiLter(names: string[]) {
  return names.map((name) => {
    const cookie = useCookie(name)
    if (cookie.value) {
      return `${name}=${encodeURIComponent(cookie.value)}`
    }
    return undefined
  }).filter(v => v !== undefined).join('; ')
}

declare module '#app' {
  interface NuxtApp {
    $urql: Client
  }
}
