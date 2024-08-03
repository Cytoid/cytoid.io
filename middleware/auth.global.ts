export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.client) {
    callOnce(async () => {
      const { init } = useWriteableAuth()
      await init().catch(() => null)
    })
  }
})
