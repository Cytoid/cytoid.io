import config from 'config'
import * as dotenv from 'dotenv'
import pkg from './package.json'
import manifest from './manifest.json'

dotenv.config()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@nuxtjs/turnstile',
    '@vite-pwa/nuxt',
    '@nuxtjs/device',
    'nuxt-gtag',
    '@teages/nuxt-locale-lite',
    // '../nuxt-urql-client/src/modules',
    '@teages/nuxt-urql-client',
  ],

  urqlClient: {
    clients: {
      default: {
        url: config.get('graphqlURL'),
        credentials: 'include',
        cookiesFilter: ['cyt:sess'],
        codegen: {
          schemaOverride: 'gql/schema.graphql',
          presetConfig: {
            fragmentMasking: false,
          },
        },
      },
    },
  },

  locale: {
    langDir: 'locale',
    lang: {
      'cs-CZ': { name: 'Čeština' },
      'de-DE': { name: 'Deutsch' },
      'en': { name: 'English' },
      'es-ES': { name: 'Inglés' },
      'pt-BR': { name: 'Português' },
      'vi-VN': { name: 'Tiếng Việt' },
      'tl-PH': { name: 'Tagalog' },
      'th-TH': { name: 'ภาษาไทย' },
      'ja-JP': { name: '日本語' },
      'ko-KR': { name: '한국어' },
      'id-ID': { name: 'Bahasa Inggris' },
      'fr-FR': { name: 'Français' },
      'hu-HU': { name: 'Angol' },
      'ms-MY': { name: 'Malay' },
      'ru-RU': { name: 'Russian' },
      'zh-CN': { name: '中文（简体）' },
      'zh-TW': { name: '中文（繁體）' },
      'zh-FJ': { name: '中文（符语）' },
    },
    defaultLocale: 'en',
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
      description: pkg.description,
      assetURL: config.get('assetURL'),
      staticURL: config.get('staticURL'),
      serviceURLClient: config.get('serviceURLClient'),
      serviceURLServer: config.get('serviceURLServer'),
      imageURL: config.get('imageURL'),
      webURL: config.get('webURL'),
      servicesUA: process.env.SERVICES_UA ?? '',
    },
  },

  turnstile: {
    siteKey: config.get('captchaKey'),
  },

  typescript: {
    tsConfig: {
      include: ['types/**/*'],
    },
  },

  gtag: {
    id: config.get('analyticsCode'),
  },

  app: {
    cdnURL: config.get('staticURL'),
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any', type: 'image/vnd.microsoft.icon' },
        { rel: 'icon', href: '/images/icon.png', type: 'image/png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' },
      ],
      script: [
        { src: 'https://polyfill.io/v3/polyfill.min.js?version=3.110.1' },
      ],
    },
  },

  pwa: process.env.NODE_ENV === 'production'
    ? {
        strategies: 'generateSW',
        registerType: 'autoUpdate',
        manifest,
        workbox: {
          navigateFallback: null,
          globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        },
        client: {
          installPrompt: true,
        },
      }
      // disable PWA in dev
    : {},

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
        target: config.get('graphqlURLProxy'),
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
