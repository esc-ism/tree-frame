const path = require('path');
const FileCopy = require('copy-webpack-plugin');
const TsconfigPaths = require('tsconfig-paths-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const shared = {
	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsconfigPaths()],
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new CleanWebpackPlugin()],
};

const standalone = {
	...shared,
	entry: './ts/standalone',
	plugins: [
		...shared.plugins,
		new FileCopy({
			patterns: [
				{from: './ts/standalone/index.html'},
				{from: './ts/standalone/background.jpeg'},
			],
		}),
	],
};

module.exports = [
	{
		...shared,
		entry: './ts/library/$Config.js',
		name: 'LIBRARY',
		mode: 'development',
		devtool: false,
		output: {
			filename: 'tree-frame.bundle.js',
			path: path.resolve(__dirname, 'bin/lib'),
			library: {
				name: '$Config',
				type: 'var',
				export: 'default',
			},
		},
	},
	{
		...standalone,
		name: 'RELEASE',
		mode: 'production',
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'bin/release'),
		},
	},
	{
		...standalone,
		name: 'DEBUG',
		mode: 'development',
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'bin/debug'),
		},
		devtool: 'eval-source-map',
		devServer: {
			static: {directory: path.join(__dirname, 'bin')},
			port: 7777,
		},
	},
];
