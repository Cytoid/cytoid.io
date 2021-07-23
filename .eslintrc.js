module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs'
  ],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    'comma-dangle': [
      'warn',
      'only-multiline'
    ],
    'import/no-named-as-default': 'off',
  }
}
