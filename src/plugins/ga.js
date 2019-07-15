export default ({ app, store }) => {
  // if (process.env.NODE_ENV !== 'production') return

  if (process.env.server || !global.window) {
    return
  }

  app.router.afterEach((to, from) => {
    global.window.gtag(
      'config',
      process.env.analyticsCode,
      {
        page_path: to.fullPath,
        user_id: app.store.state.user?.id
      }
    )
  })
}
