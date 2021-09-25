const path = require('path');

module.exports = {
    entry: './ts/index.ts',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'bin'),
        sourceMapFilename: "bundle.js.map"
    },
    devtool: "eval-source-map",
    devServer: {
        static: [
            {directory: path.join(__dirname, 'public')},
            {directory: path.join(__dirname, 'bin')},
        ],
        port: 7777,
    },
};
