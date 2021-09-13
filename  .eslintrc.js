module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
  ],
  plugins: ['jest', 'prettier', 'security'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-underscore-dangle': 0,
    'no-param-reassign': 1,
    'no-multi-spaces': 2,
    'class-methods-use-this': 0,
  },
};
