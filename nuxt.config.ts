import config from 'config'
import * as dotenv from 'dotenv'
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: pkg.description }, // TODO: i18n description
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '64x64' },
      ],
      script: [
        { src: `https://www.googletagmanager.com/gtag/js?id=${config.get('analyticsCode')}`, async: true },
        { innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${config.get('analyticsCode')}');` },
      ],
    },
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

  vite: {
    clearScreen: false,
  },
})
