import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Global ignores
  { ignores: ['**/dist', '**/node_modules', '**/coverage'] },

  // Base config for all TS files
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Node environment for backend
  {
    files: ['apps/backend/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  // React config for frontend TSX/JSX files
  {
    files: ['apps/frontend/**/*.{tsx,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // Browser globals for all frontend files
  {
    files: ['apps/frontend/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Prettier must be last to disable conflicting rules
  prettier,
);
