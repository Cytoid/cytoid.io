const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = new Koa()
const { createServer } = require('http2')

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

  // Give nuxt middleware to Koa
  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  // Listen the server
  if (process.env['HTTP2']) {
    createServer(app.callback())
      .listen(port, host, (err) => {
        if (err) {
          throw new Error(err)
        }
        consola.ready({
          message: `HTTP1.2 Server listening on http://${host}:${port}`,
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
