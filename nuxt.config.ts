import config from 'config'
import * as dotenv from 'dotenv'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import pkg from './package.json'

dotenv.config()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    'vue-recaptcha/nuxt',
  ],

  i18n: {
    vueI18n: './i18n.config.ts',
  },

  googleFonts: {
    download: false, // speed up dev by not downloading fonts
    overwriting: false,
    families: {
      'Nunito': [300, 400, 700],
      'M PLUS Rounded 1c': [300],
      'Noto Sans': true,
      'Noto Sans SC': true,
      'Noto Sans TC': true,
      'Noto Sans JP': true,
      'Noto Sans KR': true,
    },
  },

  runtimeConfig: {
    public: {
      assetURL: config.get('assetURL'),
      apiURL: config.get('serviceURLClient'),
      imageURL: config.get('imageURL'),
      webURL: config.get('webURL'),
      graphqlURL: config.get('graphql'),
      servicesUA: process.env.SERVICES_UA ?? '',
      recaptcha: {
        v2SiteKey: config.get('captchaKey'),
      },
      sentry: {
        enabled: process.env.NODE_ENV === 'production',
        dsn: config.get('sentryDSN') ?? '',
        environment: process.env.NODE_ENV ?? 'production',
        tracePropagationTarget: config.get('serviceURLClient'),
      },
    },
  },

  graphqlCodegen: {
    config: {
      schema: 'gql/schema.graphql',
      documents: ['**/*.vue'],
      ignoreNoDocuments: true, // for better experience with the watcher
      generates: {
        './gql/': {
          preset: 'client',
          presetConfig: {
            fragmentMasking: false,
          },
          config: {
            useTypeImports: true,
          },
        },
      },
    },
  },

  typescript: {
    tsConfig: {
      include: ['types/**/*'],
    },
  },

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=380, initial-scale=1' },
        { hid: 'description', name: 'description', content: pkg.description }, // TODO: i18n description
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '64x64' },
      ],
      script: [
        { src: 'https://polyfill.io/v3/polyfill.min.js?version=3.110.1' },
        { src: `https://www.googletagmanager.com/gtag/js?id=${config.get('analyticsCode')}`, async: true },
        { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${config.get('analyticsCode')}');` },
      ],
    },
  },

  legacy: {
    targets: [
      'last 2 versions and not dead',
      '> 0.3%',
      'Firefox ESR',
      'iOS >= 13.2',
    ],
    polyfills: [
      'es.object.has-own',
    ],
    modernPolyfills: [
      'es.object.has-own',
    ],
  },

  // vite
  sourcemap: {
    server: true,
    client: true,
  },
  vite: {
    clearScreen: false,
    build: {
      sourcemap: true,
    },
    plugins: [
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: config.get('sentryOrg'),
        project: config.get('sentryProject'),
        telemetry: false,
        disable: process.env.NODE_ENV !== 'production',
        debug: true,
      }),
    ],
  },

  // dev proxy
  nitro: {
    devProxy: {
      '/services': {
        target: config.get('serviceURLServer'),
        changeOrigin: true,
        prependPath: false,
        ws: true,
        headers: {
          'user-agent': process.env.SERVICES_UA ?? '',
        },
        cookieDomainRewrite: {
          'cytoid.io': 'localhost',
        },
      },
      '/graphql': {
        target: `${config.get('serviceURLServer')}/graphql`,
        changeOrigin: true,
        ws: true,
        headers: {
          'user-agent': process.env.SERVICES_UA ?? '',
        },
        cookieDomainRewrite: {
          'cytoid.io': 'localhost',
        },
      },
    },
  },
})
