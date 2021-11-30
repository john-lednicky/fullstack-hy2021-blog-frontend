/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  globals: {
    require: false,
    process: false,
    module: false,
    cy: false,
    Cypress: false,
    describe: false,
    context: false,
    beforeEach: false,
    afterEach: false,
    it: false,
    assert: false,
    expect: false,    
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react', 
    'jest',
  ],
  rules: {
    indent: [
      'error',
      2,
      { 'SwitchCase': 1 }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [
      'error', 
      'always'
    ],
    'arrow-spacing': [
      'error', { before: true, after: true }
    ],
    'no-console': 0,
    'react/prop-types': 0,
    'no-unused-vars': 0,
    'no-case-declarations': 0,
    'wrap-tests-with-act': 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}