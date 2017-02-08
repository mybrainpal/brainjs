'use strict';
const webpack                         = require('webpack'),
      validator                       = require('webpack-validator'),
      path                            = require('path'),
      WebpackGoogleCloudStoragePlugin = require('webpack-google-cloud-storage-plugin'),
      Util                            = require('./src/common/util'),
      Constants                       = require('./src/common/const');

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
if (process.env.GCLOUD_DEPLOY) {
  webpackProdConfig.plugins.push(
    new WebpackGoogleCloudStoragePlugin({
      include       : ['.js'],
      storageOptions: {
        projectId: 'nth-name-156816'
      },
      uploadOptions : {
        bucketName: 'nth-name-156816.appspot.com'
      }
    }));
}

webpackProdConfig.module.loaders.push({
                                        test  : /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                        loader: 'url-loader?limit=10000&name=[path][name].[ext]'
                                      });
webpackProdConfig.entry = Util.webpackEntries();
webpackProdConfig.output.path       = Constants.publicDir;
webpackProdConfig.output.publicPath = Constants.productionPublicPath;

module.exports = validator(webpackProdConfig);
