module.exports = {
  parser: '@typescript-eslint/parser',
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
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jest', 'prettier', 'security', 'simple-import-sort', 'import'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    "ecmaFeatures": {
      "jsx": true,
      "modules": true
  }
  },
  rules: {
    'no-underscore-dangle': 0,
    'no-param-reassign': 1,
    'no-multi-spaces': 2,
    'class-methods-use-this': 0,
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
