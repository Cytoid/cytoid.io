require('@google-cloud/trace-agent').start()
require('@google-cloud/debug-agent').start({
  serviceContext: {
    service: 'Frontend',
    version: '1.0.0'
  }
})


const { createServer } = require('http2')
const Koa = require('koa')
const conf = require('config')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const session = require('koa-session')
const router = require('koa-route')

const app = new Koa()
app.keys = [conf.secret]

// Import and Set Nuxt.js options
const config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

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

  // Old site redirects
  app.use(router.get('/browse', ctx => ctx.redirect('/levels')))
  app.use(router.get('/browse/:name', (ctx, name) => ctx.redirect('/levels/' + name)))

  // Give nuxt middleware to Koa
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  // Listen the server
  if (process.env.HTTP2) {
    createServer(app.callback())
      .listen(port, host, (err) => {
        if (err) {
          throw new Error(err)
        }
        consola.ready({
          message: `HTTP2.0 Server listening on http://${host}:${port}`,
          badge: true
        })
      })
  } else {
    app.listen(port, host, () => {
      consola.ready({
        message: `HTTP1.1 Server listening on http://${host}:${port}`,
        badge: true
      })
    })
  }
}
start()
