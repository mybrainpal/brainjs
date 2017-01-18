'use strict';
const webpack = require('webpack'),
      path    = require('path');

const isProduction = process.env.NODE_ENV === 'production';
let webpackConfig = {
    context: path.join(__dirname, './src/client'),
    entry  : {
        brain: './index.js'
    },
    output : {
        path         : path.join(__dirname, 'dist'),
        filename     : '[name].js',
        pathinfo     : true
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
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            append  : ""
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        function () {
            this.plugin('watch-run', function (watching, callback) {
                console.log(process.env.NODE_ENV + ' compile at ' + new Date());
                callback();
            })
        }]
};

if (isProduction) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        // Preserves the source map comment in minified code.
        sourceMap: true,
        compress : {
            warnings: false
        }
    }));
    webpackConfig.plugins.push(new webpack.optimize.MinChunkSizePlugin({minChunkSize: 50000}));
    webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
    webpackConfig.output.chunkFilename = '[chunkhash].js';
} else {
    webpackConfig.headers = {'Access-Control-Allow-Origin': '*'};
    webpackConfig.output.chunkFilename = '[id].js';
    webpackConfig.output.publicPath    = 'http://brainpal.dev/';
}

module.exports = webpackConfig;
