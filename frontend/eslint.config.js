// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
        '@angular-eslint/component-selector': [
            'error',
            {
              type: 'element',
              prefix: 'app',
              style: 'kebab-case',
            },
          ],
          '@angular-eslint/directive-selector': [
            'error',
            {
              type: 'attribute',
              prefix: 'app',
              style: 'camelCase',
            },
          ],
          '@angular-eslint/use-lifecycle-interface': 'error',
          '@angular-eslint/no-input-rename': 'warn',
          '@angular-eslint/no-output-rename': 'warn',
          '@angular-eslint/no-output-on-prefix': 'warn',
          '@angular-eslint/prefer-on-push-component-change-detection': 'error',
  
          // TypeScript-specific rules
          '@typescript-eslint/no-explicit-any': 'warn',
          '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
          '@typescript-eslint/explicit-module-boundary-types': 'error',
          '@typescript-eslint/explicit-function-return-type': 'error',
          '@typescript-eslint/no-empty-function': 'warn',
          '@typescript-eslint/array-type': ['error', { default: 'array' }], 
  
          // General best practices
          'no-console': ['warn', { allow: ['warn', 'error'] }],
          'no-debugger': 'error',
          'no-duplicate-imports': 'error',
          'max-len': ['warn', { code: 120 }],
          'prefer-const': 'error',
          'eqeqeq': 'error',
          'curly': ['error', 'all'],
        
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
        // Template-specific rules
        '@angular-eslint/template/no-negated-async': 'error',
        '@angular-eslint/template/no-any': 'warn', 
        '@angular-eslint/template/banana-in-box': 'error',
        '@angular-eslint/template/no-duplicate-attributes': 'warn', 
      },
  },
);