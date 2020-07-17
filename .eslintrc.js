module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    indent: ['error', 2],
    'no-tabs': ['error', { allowIndentationTabs: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': 'off',
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'func-names': ['error', 'never'],
    'prettier/prettier': ['error']
  },
  settings: {
    'import/extensions': {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
  }
};
