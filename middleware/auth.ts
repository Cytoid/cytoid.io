export default defineNuxtRouteMiddleware((to) => {
  const { isLogin, hasAuthToken } = useAuth()
  if (
    (process.server && !hasAuthToken.value)
    || (process.client && isLogin.value === false)
  ) {
    return navigateTo({
      path: '/session/login',
      query: {
        origin: encodeURIComponent(to.path),
      },
    })
  }
})
