// Thanks to https://github.com/gbicou/nuxt3-urql/blob/main/plugins/urql.ts but with some modifications.
import { createClient, ssrExchange, Client, cacheExchange, fetchExchange, SSRData } from '@urql/core'
const ssrKey = '__URQL_DATA__'

export default defineNuxtPlugin(nuxt => {
  const { vueApp } = nuxt
  
  const config = useRuntimeConfig()
  const url = config.public.graphqlURL

  const ssr = ssrExchange({
    isClient: process.client
  })

  // when app is created in browser, restore SSR state from nuxt payload
  if (process.client) {
    nuxt.hook('app:created', () => {
      ssr.restoreData(nuxt.payload[ssrKey] as SSRData)
    })
  }

  // when app has rendered in server, send SSR state to client
  if (process.server) {
    nuxt.hook('app:rendered', () => {
      nuxt.payload[ssrKey] = ssr.extractData()
    })
  }

  const client = createClient({
    url,
    exchanges: [
      cacheExchange,
      ssr, // Add `ssr` in front of the `fetchExchange`
      fetchExchange,
    ],
    fetchOptions: {
      credentials: 'include'
    }
  })

  nuxt.provide('urql', client)
  vueApp.provide('$urql', client)
})

declare module '#app' {
  interface NuxtApp {
    $urql: Client
  }
}
