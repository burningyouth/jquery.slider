module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base', 'prettier', 'plugin:fsd/all'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    projects: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'fsd'],
  rules: {
    indent: ['error', 2],
    'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'func-names': ['error', 'never'],
  },
  settings: {
    'import/extensions': {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },
};
