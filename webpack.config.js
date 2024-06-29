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
	plugins: [new FileCopy({patterns: [{from: './ts/standalone/index.html'}]}), new CleanWebpackPlugin()],
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
		plugins: [new CleanWebpackPlugin()],
	},
	{
		...shared,
		entry: './ts/standalone',
		name: 'DEVELOPMENT',
		mode: 'development',
		devtool: 'eval-source-map',
		devServer: {
			static: {directory: path.join(__dirname, 'bin')},
			port: 7777,
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'bin/debug'),
		},
	},
	{
		...shared,
		entry: './ts/standalone',
		name: 'PRODUCTION',
		mode: 'production',
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'bin/release'),
		},
	},
];
