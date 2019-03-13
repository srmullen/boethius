const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: {
        "index": "./index"
    },
    output: {
        path: path.join(__dirname, "bin"),
        filename: "[name].js"
    },
    plugins: [
        // Add shebang to bin file.
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
                exclude: [/node_modules/, path.join(__dirname, 'lang')]
            }
        ]
    },
    target: 'node'
}
