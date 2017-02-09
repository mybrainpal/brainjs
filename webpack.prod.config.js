'use strict';
const webpack   = require('webpack'),
      path      = require('path'),
      Util      = require('./src/common/util'),
      Constants = require('./src/common/const');

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
webpackProdConfig.module.rules.push({
                                      test: /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                      use : [{
                                        loader: 'url-loader',
                                        query : 'limit=10000&name=[path][name].[ext]'
                                      }]
                                    });
webpackProdConfig.entry = Util.webpackEntries();
webpackProdConfig.output.path       = Constants.publicDir;
webpackProdConfig.output.publicPath = Constants.productionPublicPath;

module.exports = webpackProdConfig;
