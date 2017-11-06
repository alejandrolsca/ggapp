var webpack = require("webpack"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
    path = require("path");

var extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});

module.exports = function (env) {
    return {
        entry: {
            vendor: ["./src/vendor.js"],
            app: ["./src/main.js"],
        },
        output: {
            publicPath: "/",
            path: path.join(path.resolve(), "dist"),
            filename: "[name].[hash].js"
        },
        module: {
            rules: [
                {
                // JS LOADER
                // Reference: https://github.com/babel/babel-loader
                // Transpile .js files using babel-loader
                // Compiles ES6 and ES7 into ES5 code
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node_modules/,/bower_components/]
            },
                {
                    test: /\.(scss|css)$/i,
                    use: extractSass.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: "sass-loader", options: {
                                sourceMap: true
                            }
                        }],
                        // use style-loader in development
                        fallback: "style-loader"
                    })
                },
                {
                    test: /\.(png|jpe?g|gif)(\?.*)?$/,
                    loader: 'file-loader',
                    query: {
                        limit: 10000,
                        name: 'static/img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
                    loader: 'file-loader',
                    query: {
                        limit: 10000,
                        name: 'static/fonts/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                }
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                names: ['app', 'vendor'], // Order matters: right to left.
                minChunks: Infinity
            }),
            new CleanWebpackPlugin(['dist'], {
                root: path.resolve(),
                verbose: false,
                dry: false,
                exclude: [],
                watch: true
            }),
            new HtmlWebpackPlugin({
                template: 'src/index.html',
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            }),
            extractSass
        ]
    }
}