import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'gql',
    '__generated__',
  ],
}, {
  rules: {
    'node/prefer-global/process': ['error', 'always'],
    'curly': ['error', 'all'],
  },
})
