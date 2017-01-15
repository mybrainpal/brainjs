'use strict';
const webpack = require('webpack'),
      path    = require('path');

module.exports = {
    context: path.join(__dirname, "./src/client"),
    entry  : {
        brain: "./index.js"
    },
    output : {
        path    : path.join(__dirname, "dist"),
        filename: "[name].js",
        pathinfo: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss', '.css', '']
    },
    module : {
        loaders: [
            {
                test   : /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader : 'babel-loader',
                query  : {
                    presets: ['es2015']
                }
            },
            {
                test   : /\.css$/,
                loaders: [
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[local]',
                    'sass?sourceMap&localIdentName=[local]'
                ],
                // Used to allow loading css without name localization, such as when loading css
                // from npm packages.
                exclude: /\.local\.css$/
            },
            {
                test   : /\.(scss|local\.css)$/,
                loaders: [
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[local]--[hash:base64:5]',
                    'sass?sourceMap&localIdentName=[local]--[hash:base64:5]'
                ],
                exclude: /node_modules/
            },
            {
                test  : /\.(png|svg|woff|jpg)$/,
                loader: 'url-loader?limit=10000&name=[path][name].[ext]'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            // Preserves the source map comment in minified code.
            sourceMap  : true,
            compress   : {
                warnings: false
            },
            cacheFolder: path.resolve(__dirname, 'cached_uglify/')
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: "[name].js.map",
            append  : ""
        }),
        function () {
            this.plugin('watch-run', function (watching, callback) {
                console.log('Begin compile at ' + new Date());
                callback();
            })
        }
    ]
};
