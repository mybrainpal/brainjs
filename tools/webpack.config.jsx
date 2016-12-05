'use strict';
let ConcatSource = require('webpack-sources').ConcatSource;

class StrictPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('compilation', compilation => {
            compilation.moduleTemplate.plugin('render', (moduleSource, module, chunk, dependencyTemplates) => {
                if (module.resource && module.resource.startsWith(this.options.root)) {
                    return new ConcatSource('\'use strict\';\n', moduleSource);
                }
                return moduleSource;
            });
            compilation.moduleTemplate.plugin('hash', hash => {
                hash.update('StrictPlugin');
                hash.update('1');
            });
        });
    }
}

// module.exports = {
//     entry: require('glob').sync('./src/client/**/*.js'),
//     output: {
//         filename: 'brain.js',
//         path: './dist'
//     },
//     loaders: [
//         {
//             test: /\.js$/,
//             exclude: /(node_modules|bower_components)/,
//             loader: 'babel-loader',
//             query: {
//                 presets: ['es2015']
//             }
//         }
//     ],
//     plugins: [
//         new StrictPlugin({
//             root: __dirname.split('/').slice(0, -1).join('/') + // removes '/tools'
//                   '/src/client'
//         })
//     ]
//
// };
var webpack = require('webpack');
var path = require('path');

var commonConfig = {
    resolve: {
        extensions: ['', '.ts', '.js', '.json']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ],
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]

};


var clientConfig = {
    target: 'web',
    entry: require('glob').sync('./src/client/**/*.js'),
    output: {
        filename: 'brain.js',
        path: './dist'
    },
    node: {
        global: true,
        __dirname: true,
        __filename: true,
        process: true,
        Buffer: false
    }
};


// Default config
var defaultConfig = {
    // context: __dirname,
    // resolve: {
    //     root: '../src/'
    // },
    // output: {
    //     filename: 'brain.js',
    //     path: './dist'
    // },
};
var webpackMerge = require('webpack-merge');
module.exports = [
    // Client
    webpackMerge({}, defaultConfig, commonConfig, clientConfig),
];
// webpack --config tools/webpack.config.jsx --optimize-minimize --optimize-dedupe