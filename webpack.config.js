const path = require('path');
const FileCopy = require('copy-webpack-plugin');
const TsconfigPaths = require('tsconfig-paths-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const shared = {
	entry: './ts',
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
	plugins: [new FileCopy({patterns: [{from: './static'}]}), new CleanWebpackPlugin()],
};

module.exports = [
	{
		...shared,
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
		name: 'PRODUCTION',
		mode: 'production',
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'bin/release'),
		},
	},
];
