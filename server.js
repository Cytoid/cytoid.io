const conf = require('config')
const express = require('express')
const redis = require('redis')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const RedisStore = require('connect-redis')(session)
const config = require('./nuxt.config.js')

config.dev = !(process.env.NODE_ENV === 'production')

async function getNuxtInstance() {
  if (config.dev) {
    const { Nuxt, Builder } = require('nuxt')
    const nuxt = new Nuxt(config)
    const builder = new Builder(nuxt)
    await builder.build()
    return nuxt
  } else {
    const { Nuxt } = require('nuxt-start')
    const nuxt = new Nuxt(config)
    await nuxt.ready()
    return nuxt
  }
}

getNuxtInstance()
  .then((nuxt) => {
    // Give nuxt middleware to Koa

    const app = express()
    app.set('trust proxy', 1)
    const cookieOptions = {
      maxAge: 86400000,
      httpOnly: true,
      secure: !config.dev,
      domain: config.dev ? 'localhost' : 'cytoid.io',
    }
    app.use(cookieParser(conf.secret, cookieOptions))
    app.use(session({
      store: new RedisStore({ client: redis.createClient(conf.redis) }),
      secret: conf.secret,
      resave: false,
      rolling: false,
      saveUninitialized: false,
      cookie: cookieOptions,
      name: 'cyt:sess',
    }))
    app.use(nuxt.render)

    const {
      host = process.env.HOST || '127.0.0.1',
      port = process.env.PORT || 3000
    } = nuxt.options.server
    app.listen(port, host, () => {
      console.log(`HTTP1.1 Server listening on http://${host}:${port}`)
    })
  })
