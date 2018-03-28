var webpack = require('webpack');
module.exports = {
    entry: {
        teacher: "./src/teacher/index.js",
        student: "./src/student/index.js"
    },
    output: {
        path: './dist',
        filename: "[name]-bundle.js"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: ['transform-decorators-legacy', 'transform-class-properties']
                },
                exclude: /node_modules/
            }, {
                test: /\.(png|jpg|jpeg)?$/,
                loader: "file-loader?name=images/[name].[ext]"
            }
        ]
    },
    plugins: [],
    watch: false,
    watchOptions: {
        aggregateTimeout: 1000,
        poll: 1000,
        ignored: /node_modules/
    }
};
