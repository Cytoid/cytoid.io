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
    '@/assets/styles/bulma.scss',
  ],

  /*
   ** Global SCSS definitions
   */
  styleResources: {
    scss: [
      '@/assets/styles/index.scss',
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/vee-validate' },
    { src: '~plugins/authentication', mode: 'client' },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
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

  buefy: {
    css: false,
    materialDesignIcons: true,
    defaultIconPack: 'fas',
    materialDesignIconsHRef: 'https://use.fontawesome.com/releases/v5.7.2/css/all.css',
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
