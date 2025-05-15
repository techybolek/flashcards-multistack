module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      // TypeScript files
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
        tsconfigRootDir: '.',
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
    },
    {
      // JavaScript files
      files: ['*.js', '*.jsx', '*.cjs', '*.mjs'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    {
      // JavaScript test files
      files: ['tests/**/*.js'],
      env: {
        mocha: true,
        jest: true
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'no-unused-vars': 'warn'
      }
    },
    {
      // Astro files
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/no-unknown-property': 'off',
        'react/jsx-no-undef': ['error', { allowGlobals: true }],
        'react/no-unescaped-entities': 'off'
      }
    }
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/alt-text': 'warn',
    'jsx-a11y/aria-props': 'warn',
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+
    'react/no-unescaped-entities': 'off', // Allow unescaped quotes for better readability
    '@typescript-eslint/no-unused-vars': ['warn', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off' // Since we're using TypeScript
  },
  ignorePatterns: ['dist/**', 'node_modules/**'],
}; 