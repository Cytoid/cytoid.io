export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  return proxyRequest(event, `${config.public.serviceURLServer}/graphql`)
})
