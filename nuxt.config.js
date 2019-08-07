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
    imageURL: config.get('imageURL'),
    webURL: config.get('webURL'),
    cmsURL: config.get('cmsURL'),
    analyticsCode: config.get('analyticsCode')
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,700,700i&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c:300,400&display=swap' }
    ],
    script: [
      { src: 'https://www.googletagmanager.com/gtag/js?id=' + config.get('analyticsCode'), async: true },
      { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${config.get('analyticsCode')}');` }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  meta: {
    theme_color: 'hsla(226, 15%, 14%, 1)',
    nativeUI: true,
    appleStatusBarStyle: 'black-translucent',
  },
  icon: {
    iconSrc: '~assets/images/icon.png',
  },

  /*
  ** Global CSS
  */
  css: [
    '~assets/styles/index.less',
    '~assets/styles/bulma.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'easymde/dist/easymde.min.css',
  ],

  /*
   ** Global SCSS definitions
   */
  styleResources: {
    less: [
      '~assets/styles/theme.less',
    ],
    scss: [
      '~assets/styles/bulma-theme.scss',
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/ga' },
    { src: '~plugins/antd' },
    { src: '~plugins/parallax' },
    { src: '~plugins/fontawesome' },
    { src: '~plugins/imgresize' },
    { src: '~plugins/authentication', mode: 'client' },
    { src: '~plugins/nossr', mode: 'client' },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    ['nuxt-recaptcha-v2', {
      key: config.get('captchaKey'),
    }],
    '~modules/generate.js',
    '~modules/i18n.js'
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
  router: {
    linkExactActiveClass: 'is-exact-active',
    linkActiveClass: 'is-active',
    middleware: [
      'background',
      'trailing_slash',
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    analyze: false,
    publicPath: config.get('staticURL'),
    filenames: {
      app: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].app.js',
      chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[chunkhash].js',
      css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css',
      img: 'img/[name].[ext]',
      font: 'font/[name].[ext]',
      video: 'vid/[name].[ext]',
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-optional-chaining',
      ]
    },
    extend(config, ctx) {
      ctx.loaders.less.javascriptEnabled = true
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
