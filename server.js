const Koa = require('koa')
const conf = require('config')
const session = require('koa-session')
const config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const app = new Koa()
app.keys = [conf.secret]

app.use(session({
  key: 'cytoid:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
}, app))

if (config.dev) {
  const routeRegex = /^\/api(\/.+)/
  app.use(require('koa-proxy')({
    host: require('config').apiURLServer,
    match: routeRegex,
    jar: true, // send cookies
    followRedirect: false,
    map: (path) => {
      const test = routeRegex.exec(path)
      return test ? test[1] : path
    }
  }))
} else {
  // Old site redirects
  const router = require('koa-route')
  app.use(router.get('/browse', ctx => ctx.redirect('/levels')))
  app.use(router.get('/browse/:name', (ctx, name) => ctx.redirect('/levels/' + name)))
}

function getNuxtInstance() {
  if (config.dev) {
    const { Nuxt, Builder } = require('nuxt')
    const nuxt = new Nuxt(config)
    const builder = new Builder(nuxt)
    return builder
      .build()
      .then(() => nuxt)
  } else {
    const { Nuxt } = require('nuxt-start')
    const nuxt = new Nuxt(config)
    return nuxt.ready()
      .then(() => nuxt)
  }
}

getNuxtInstance()
  .then((nuxt) => {
    // Give nuxt middleware to Koa
    app.use((ctx) => {
      ctx.status = 200
      ctx.respond = false // Mark request as handled for Koa
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    })

    const {
      host = process.env.HOST || '127.0.0.1',
      port = process.env.PORT || 3000
    } = nuxt.options.server
    return { host, port }
  })
  .then(({ host, port }) => {
    if (process.env.HTTP2) {
      const { createServer } = require('http2')
      createServer(app.callback())
        .listen(port, host, (err) => {
          if (err) {
            throw new Error(err)
          }
          console.log(`HTTP2.0 Server listening on http://${host}:${port}`)
        })
    } else {
      app.listen(port, host, () => {
        console.log(`HTTP1.1 Server listening on http://${host}:${port}`)
      })
    }
  })
