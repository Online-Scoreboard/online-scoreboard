module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-use-before-define': ['error', { functions: true, classes: true }],
    'sort-keys': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
