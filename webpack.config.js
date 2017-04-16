var webpack = require("webpack"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require("path");

var extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});

module.exports = {
    amd: { jQuery: true },
    devtool: "source-map",
    entry: {
        app: "./src/main.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].[hash].js"
    },
    plugins:[
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(),
            verbose: true,
            dry: false,
            exclude: [],
            watch: true
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        extractSass
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/i,
                use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader", options: {
                            sourceMap: true
                        }
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
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
    }

}