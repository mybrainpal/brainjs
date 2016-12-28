'use strict';

module.exports = {
    entry   : './src/client/index.js',
    output  : {
        filename: 'brain.js',
        path    : './dist'
    },
    devtools: 'source-map',
    resolve : {
        extensions: ['.js', '.jsx', '.css', '.scss', '.jpg', '']
    },
    module  : {
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
                test   : /\.s?css/,
                loaders: [
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[local]--[hash:base64:5]',
                    'sass?sourceMap&localIdentName=[local]--[hash:base64:5]'
                ],
                exclude: /node_modules|lib/
            },
            {
                test  : /\.(png|jpe?g|gif)$/,
                loader: "file-loader?name=img/[name]--[hash:5].[ext]"
            }
        ]
    },
    plugins : []
};
