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

module.exports = {
    entry: require('glob').sync('./src/client/**/*.js'),
    output: {
        filename: 'brain.js',
        path: './dist'
    },
    devtools: 'source-map',
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
    plugins: [
        new StrictPlugin({
            root: __dirname.split('/').slice(0, -1).join('/') + // removes '/tools'
                  '/src/client'
        })
    ]

};

// webpack --config tools/webpack.config.jsx --optimize-minimize --optimize-dedupe