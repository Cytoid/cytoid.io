const config = require('config')
const pkg = require('./package')

module.exports = {
  srcDir: 'src',
  telemetry: false,
  dir: {
    static: '../public',
  },
  server: {
    port: process.env.PORT || 8080,
    host: process.env.HOST || '0.0.0.0',
  },
  env: {
    assetURL: config.get('assetURL'),
    apiURL: config.get('serviceURLClient'),
    imageURL: config.get('imageURL'),
    webURL: config.get('webURL'),
    analyticsCode: config.get('analyticsCode'),
    captchaKey: config.get('captchaKey'),
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
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '64x64' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:300,300i,400,400i,700,700i&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c:300,400&display=swap' }
    ],
    script: [
      { src: 'https://www.googletagmanager.com/gtag/js?id=' + config.get('analyticsCode'), async: true },
      { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${config.get('analyticsCode')}');` }
    ],
    __dangerouslyDisableSanitizers: ['script']
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  meta: {
    theme_color: 'hsla(226, 15%, 14%, 1)',
    nativeUI: true,
  },
  icon: {
    iconSrc: './src/assets/images/icon.png',
  },

  /*
  ** Global CSS
  */
  css: [
    '~assets/styles/bulma.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
    'easymde/dist/easymde.min.css',
  ],

  /*
   ** Global SCSS definitions
   */
  styleResources: {
    scss: [
      '~assets/styles/bulma-theme.scss',
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/ga' },
    { src: '~plugins/dummy_captcha' },
    { src: '~plugins/fontawesome' },
    { src: '~plugins/antd' },
    { src: '~plugins/buefy' },
    { src: '~plugins/parallax' },
    { src: '~plugins/authentication', mode: 'client' },
    { src: '~plugins/nossr', mode: 'client' },
    { src: '~plugins/veevalidate' },
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '~modules/generate.js',
    '~modules/i18n.js'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: config.get('serviceURLServer'),
    browserBaseURL: config.get('serviceURLClient'),
    progress: true,
    credentials: true,
  },
  apollo: {
    tokenName: 'cytoid:graph',
    cookieAttributes: {
      expires: 7,
      path: '/',
      secure: false,
    },
    includeNodeModules: false,
    authenticationType: 'Bearer',
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network',
      },
    },
    clientConfigs: {
      default: {
        httpEndpoint: config.get('serviceURLServer') + '/graphql',
        browserHttpEndpoint: config.get('serviceURLClient') + '/graphql',
        httpLinkOptions: {
          credentials: 'include'
        },
        wsEndpoint: null,
        persisting: true,
        websocketsOnly: false
      },
    }
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
    /*
    analyze: {
      analyzerMode: 'static'
    },
    */
    transpile: [
      'vee-validate'
    ],
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
        '@babel/plugin-proposal-export-default-from',
      ],
      presets ({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    },
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      })
      const urlLoaderRule = config.module.rules.find(rule => rule.use && rule.use.find(u => u.loader.includes('url-loader')))
      urlLoaderRule.test = /\.(png|jpe?g|gif|webp)$/i
      ctx.loaders.less.javascriptEnabled = true
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        const ESLintPlugin = require('eslint-webpack-plugin')
        config.plugins.push(new ESLintPlugin({
          // ESLint options
        }))
      }
    }
  }
}
