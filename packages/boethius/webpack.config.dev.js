const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
    devtool: "eval-source-map",
    entry: [
        "./src/Scored"
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "boethius.js"
    },
    plugins:[
        new DashboardPlugin({
            port: 4001
        }),
        new HtmlWebpackPlugin({
            filename: "score.html",
            inject: "head",
            template: "./examples/score.html"
        }),
        new HtmlWebpackPlugin({
            filename: "errors.html",
            inject: "head",
            template: "./examples/errors.html"
        })
    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ["babel-loader"],
            include: path.join(__dirname, "src")
        }, {
            test: /\.html/,
            loader: "raw-loader"
        }]
    },
    devServer: {
        contentBase: "."
    }
}
