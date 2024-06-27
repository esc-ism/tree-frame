import globals from 'globals';

import path from 'path';
import {fileURLToPath} from 'url';
import {FlatCompat} from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import parser from '@typescript-eslint/parser';
import stylisticJs from '@stylistic/eslint-plugin-js';
import stylistic from '@stylistic/eslint-plugin';
import emptyIndent from 'eslint-plugin-indent-empty-lines';
import typescriptEslint from '@typescript-eslint/eslint-plugin';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended});

export default [
	{files: ['**/*.ts'], languageOptions: {sourceType: 'module'}},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.greasemonkey,
			},
			parser,
			parserOptions: {
				sourceType: 'module',
				ecmaFeatures: {globalReturn: true},
				requireConfigFile: false,
				babelOptions: {
					babelrc: false,
					configFile: false,
				},
			},
		},
	},
	...compat.extends('eslint:recommended'),
	stylistic.configs.customize({
		semi: (true),
		braceStyle: '1tbs',
		indent: 'tab',
	}),
	{
		plugins: {
			'@stylistic/js': stylisticJs,
			'indent-empty-lines': emptyIndent,
			'@typescript-eslint': typescriptEslint,
		},
		rules: {
			'require-await': 'error',
			'no-debugger': 'warn',
			'no-console': ['warn', {allow: ['warn', 'error']}],
			'jsdoc/require-jsdoc': 'off',
			'@stylistic/no-extra-semi': 'error',
			'@stylistic/no-extra-parens': 'error',
			'@stylistic/no-tabs': ['error', {allowIndentationTabs: true}],
			'@stylistic/object-curly-spacing': ['error', 'never'],
			'@stylistic/operator-linebreak': ['error', 'before', {overrides: {'?': 'after', ':': 'after'}}],
			'@stylistic/object-curly-newline': ['error', {multiline: true}],
			'@stylistic/arrow-parens': ['error', 'always'],
			'@stylistic/js/linebreak-style': ['error', 'unix'],
			'@stylistic/no-trailing-spaces': ['error', {skipBlankLines: true}],
			'@stylistic/array-bracket-newline': ['error', {multiline: true}],
			'@stylistic/array-element-newline': ['error', 'consistent'],
			'indent-empty-lines/indent-empty-lines': ['error', 'tab'],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'no-undef': 'off',
		},
	},
];
