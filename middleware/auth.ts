export default defineNuxtRouteMiddleware((to) => {
  const { isLogin, hasAuthToken } = useAuth()
  if (
    (import.meta.server && !hasAuthToken.value)
    || (import.meta.client && isLogin.value === false)
  ) {
    return navigateTo({
      path: '/session/login',
      query: {
        origin: encodeURIComponent(to.path),
      },
    })
  }
})
