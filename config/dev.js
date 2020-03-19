var webpack = require("webpack"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    path = require("path");

module.exports = function (env) {
    return {
        devServer: {
            contentBase: path.join(path.resolve(), "dist"),
            historyApiFallback: true,
            compress: true,
            host: 'localhost',
            disableHostCheck: true,
            port: 4000,
            proxy: {
                "/api/*": {
                    target: "http://localhost:8080"
                },
                "/uploads/*": {
                    target: "http://localhost:8080/"
                }
            },
            stats: {
                // Add asset Information
                assets: true,
                // Sort assets by a field
                assetsSort: "name",
                // Add information about cached (not built) modules
                cached: true,
                // Show cached assets (setting this to `false` only shows emitted files)
                cachedAssets: true,
                // Add children information
                children: false,
                // Add chunk information (setting this to `false` allows for a less verbose output)
                chunks: false,
                // Add built modules information to chunk information
                chunkModules: false,
                // Add the origins of chunks and chunk merging info
                chunkOrigins: false,
                // Sort the chunks by a field
                chunksSort: "name",
                // Context directory for request shortening
                context: "./src/",
                // `webpack --colors` equivalent
                colors: true,
                // Display the distance from the entry point for each module
                depth: false,
                // Display the entry points with the corresponding bundles
                entrypoints: false,
                // Add errors
                errors: true,
                // Add details to errors (like resolving log)
                errorDetails: true,
                // Exclude modules which match one of the given strings or regular expressions
                exclude: [],
                // Add the hash of the compilation
                hash: true,
                // Set the maximum number of modules to be shown
                maxModules: 15,
                // Add built modules information
                modules: false,
                // Sort the modules by a field
                modulesSort: "name",
                // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
                moduleTrace: true,
                // Show performance hint when file size exceeds `performance.maxAssetSize`
                performance: true,
                // Show the exports of the modules
                providedExports: false,
                // Add public path information
                publicPath: false,
                // Add information about the reasons why modules are included
                reasons: true,
                // Add the source code of modules
                source: true,
                // Add timing information
                timings: false,
                // Show which exports of a module are used
                usedExports: false,
                // Add webpack version information
                version: true,
                // Add warnings
                warnings: true,
                // Filter warnings to be shown (since webpack 2.4.0),
                // can be a String, Regexp, a function getting the warning and returning a boolean
                // or an Array of a combination of the above. First match wins.
                // warningsFilter: "filter" | /filter/ | ["filter", /filter/] | (warning) => ... return true| false
            }
        },
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
                    use: ExtractTextPlugin.extract({
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
            new ExtractTextPlugin({
                filename: "[name].[contenthash].css"
            })
        ]
    }
}