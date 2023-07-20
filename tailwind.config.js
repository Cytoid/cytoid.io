/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './*.vue',
  ],
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  theme: {
    container: {
      center: true,
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dracula]'],
          primary: '#a5b4fc',
          secondary: '#d8b4fe',
          accent: '#ffb86b',
        },
      },
    ],
    logs: false,
  },
}
