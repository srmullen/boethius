const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
    devtool: "eval-source-map",
    entry: {
        "./site/bundle": "./examples/loader"
    },
    output: {
        path: "/",
        filename: "[name].js"
    },
    plugins:[
        new DashboardPlugin({
            port: 4001
        }),
        new HtmlWebpackPlugin({
            filename: "score.html",
            template: "./examples/score.html"
        }),
        new HtmlWebpackPlugin({
            filename: "errors.html",
            template: "./examples/errors.html"
        })
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ["style-loader", "css-loader"]
        },
        {
            test: /\.js$/,
            loaders: ["babel-loader"],
            include: [path.join(__dirname, "src"), path.join(__dirname, "examples")]
        }, {
            test: /\.html/,
            loader: "raw-loader"
        },
        {
            test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader : 'file-loader'
        }]
    },
    devServer: {
        contentBase: "."
    }
}
