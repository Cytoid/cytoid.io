import type { Config } from 'tailwindcss'

import typographyPlugin from '@tailwindcss/typography'
import daisyui from 'daisyui'

import daisyuiThemes from 'daisyui/src/theming/themes'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './*.vue',
  ],
  plugins: [typographyPlugin, daisyui],
  theme: {
    container: {
      center: true,
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...daisyuiThemes.dracula,
          primary: '#a5b4fc',
          secondary: '#d8b4fe',
          accent: '#ffb86b',
        },
      },
    ],
    logs: false,
  },
} satisfies Config
