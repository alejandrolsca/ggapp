var webpack = require("webpack");
var path = require("path");
module.exports = {
    entry: {
        app: "./src/app/app.js"
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    }
}