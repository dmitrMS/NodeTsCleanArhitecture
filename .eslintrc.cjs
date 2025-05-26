module.exports = {
  env: {
    node: true,
    es2021: true,
    'jest/globals': true // для jest global functions
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error'
    // по желанию свои правила, например:
    // '@typescript-eslint/no-explicit-any': 'warn',
  }
};
