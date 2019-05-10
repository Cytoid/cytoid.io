const config = require('config')
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  srcDir: 'src',
  dir: {
    static: '../public',
  },
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
  },
  env: {
    assetURL: config.get('assetURL'),
    apiURL: config.get('apiURLClient'),
  },
  generate: {
    subFolders: false,
  },
  head: {
    title: 'Cytoid',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    'ant-design-vue/dist/antd.css',
  ],

  /*
   ** Global SCSS definitions
   */
  styleResources: {
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/vee-validate' },
    { src: '~plugins/antd' },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '@nuxtjs/auth',
    '~modules/generate.js',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: config.get('apiURLServer'),
    browserBaseURL: config.get('apiURLClient'),
    progress: true,
    credentials: true,
  },

  auth: {
    strategies: {
      local: {
        _scheme: '~/modules/passportAuthStrategy.js',
        endpoints: {
          login: { url: '/session', method: 'post', propertyName: null },
          logout: { url: '/session', method: 'delete' },
          user: { url: '/session', method: 'get', propertyName: 'user' }
        },
        tokenRequired: false,
        tokenType: 'bearer',
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    analyze: process.env.NODE_ENV === 'development',
    publicPath: config.get('staticURL'),
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css',
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
      ]
    },
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
