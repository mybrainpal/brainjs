'use strict';
const webpack   = require('webpack'),
      validator = require('webpack-validator');

if (process.env.NODE_ENV !== 'production') {
  throw Error('NODE_ENV must be "production" when using webpack.prod.config.js.');
}

let webpackProdConfig = require('./webpack.config');

webpackProdConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
  sourceMap: true,
  compress : {
    warnings: false
  }
}));
webpackProdConfig.plugins.push(new webpack.optimize.MinChunkSizePlugin({minChunkSize: 50000}));
webpackProdConfig.plugins.push(new webpack.optimize.DedupePlugin());
webpackProdConfig.module.loaders.push({
                                        test  : /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                        loader: 'url-loader?limit=10000&name=[path][name].[ext]'
                                      });
webpackProdConfig.output.publicPath = 'http://cdn.brainpal.io/';

module.exports = validator(webpackProdConfig);
