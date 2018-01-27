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
    target: 'node'
}
