var webpack = require("webpack"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    path = require("path");

module.exports = {
    entry: {
        app: "./src/app/app.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins:[
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(),
            verbose: true,
            dry: false,
            exclude: [],
            watch: true
        })
    ]
}