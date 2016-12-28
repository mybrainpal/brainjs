'use strict';

module.exports = {
    entry   : './src/client/index.js',
    output  : {
        filename: 'brain.js',
        path    : './dist'
    },
    devtools: 'source-map',
    resolve : {
        extensions: ['.js', '.jsx', '.css', '.scss', '']
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
                    'css?sourceMap&modules&importLoaders=1&localIdentName=[name]--[hash:base64:3]',
                    'sass?sourceMap&localIdentName=[name]--[hash:base64:3]'
                ],
                exclude: /node_modules|lib/
            }
        ]
    },
    plugins : []
};
