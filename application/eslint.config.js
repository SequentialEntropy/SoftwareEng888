/**
 * eslint.config.js - ESLint configuration file for the project
 *
 * @file Configures ESLint to enforce coding standards 
 * @author Carina Jose
 * @author Amreet Dhillon
 * @version 1.0.0
 * @since 2025-02-20
 */

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] }, // Ignore the 'dist' folder for linting 
  {
    files: ['**/*.{js,jsx}'], // Applies rules to all JS and JSX files 
    languageOptions: {
      ecmaVersion: 2020, //ECMAScript 2020 support 
      globals: globals.browser, // Include browser global variables
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enables JSX parsing 
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules, // Includes recommended JS rules
      ...react.configs.recommended.rules, // Includes recommended React rules 
      ...react.configs['jsx-runtime'].rules, // Enables JSX runtime rules
      ...reactHooks.configs.recommended.rules, // Enforces React hooks best practices 
      'react/jsx-no-target-blank': 'off', // Disables target =_blank security rule 
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }, // Allows exporting constants in React Refresh 
      ],
    },
  },
]
