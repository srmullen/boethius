const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
    devtool: "eval-source-map",
    entry: {
        "./site/score": "./examples/score",
        "./site/errors": "./examples/errors",
        "./site/plugins": "./examples/plugins"
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
            template: "./examples/score.html",
            chunks: ["./site/score"]
        }),
        new HtmlWebpackPlugin({
            filename: "errors.html",
            template: "./examples/errors.html",
            chunks: ["./site/errors"]
        }),
        new HtmlWebpackPlugin({
            filename: 'plugins.html',
            template: './examples/plugins.html',
            chunks: ['./site/plugins']
        })
    ],
    resolve: {
        alias: {
            styles: path.join(__dirname, "styles"),
            paper: 'paper/dist/paper-core'
        }
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        },
        {
            test: /\.js$/,
            // use: ["babel-loader"],
            use: "babel-loader",
            include: [path.join(__dirname, "src"), path.join(__dirname, "examples")]
        }, {
            test: /\.html/,
            use: "raw-loader"
        },
        {
            test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            use : 'file-loader'
        }]
    },
    devServer: {
        contentBase: "."
    }
}
