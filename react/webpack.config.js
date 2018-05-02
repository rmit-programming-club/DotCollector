const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name]-bundle.js",
    },
    mode: "development",
    devServer: {
        proxy: { // proxy URLs to backend development server
            '/api': 'http://localhost:3000'
        },
        hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
        historyApiFallback: { index: '/' }
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        // presets: ['@babel/preset-env']
                        // plugins: ['@babel/plugin-transform-runtime']
                        presets: ['es2015', 'react', 'stage-0'],
                        plugins: ['transform-decorators-legacy', 'transform-class-properties']
                    }
                },
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|jpeg)?$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: './resources/[name].[ext]'
                    }
                }
            }, {
                test: /\.sass$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            }, {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }, {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: './resources/[name].[ext]'
                    }
                }
            }, {
                test: /\.html$/,
                use: {
                    loader: "html-loader"
                }
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ],
    watch: false,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: 1000,
        ignored: /node_modules/
    }
};
