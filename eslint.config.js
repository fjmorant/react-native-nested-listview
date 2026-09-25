const reactNativeConfig = require('@react-native/eslint-config/flat');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    ignores: ['dist/**', 'coverage/**'],
  },

  ...reactNativeConfig,

  // Must come after the React Native config: that config applies
  // eslint-config-prettier, which turns formatting rules off. This turns
  // prettier/prettier back on as an error, so `yarn lint` enforces formatting.
  prettierRecommended,

  {
    rules: {
      semi: 'off',
      'react/jsx-no-bind': 'error',
    },
  },
];
