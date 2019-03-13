const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        "./site/score": "./examples/score",
        "./site/errors": "./examples/errors"
    },
    output: {
        path: "./",
        filename: "[name].js"
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new HtmlWebpackPlugin({
            template: "./examples/score.html",
            chunks: ["./site/score"]
        })
    ],
    resolve: {
        alias: {
            styles: path.join(__dirname, "styles"),
            paper: 'paper/dist/paper-core'
        }
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ["style-loader", "css-loader"]
        },
        {
            test: /\.js$/,
            loaders: ["babel-loader"],
            include: [path.join(__dirname, "src"), path.join(__dirname, "examples")]
        },
        {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file-loader?name=./site/[path][name].[ext]'
        }]
    }
}
