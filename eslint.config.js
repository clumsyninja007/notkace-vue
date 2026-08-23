import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  skipFormatting,
  {
    // this config file and vite.config.ts run in Node
    files: ['eslint.config.js', 'vite.config.ts'],
    languageOptions: {
      globals: { process: 'readonly' },
    },
  },
  {
    rules: {
      // the store and its mapped helpers are loosely typed throughout; this was
      // a warning under the old @vue/typescript/recommended config too
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
];
