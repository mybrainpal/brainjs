'use strict';
const webpack   = require('webpack'),
      validator = require('webpack-validator'),
      path      = require('path'),
      Util      = require('./src/common/util'),
      Constants = require('./src/common/const');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

let webpackConfig = {
  context: path.join(__dirname, Constants.clientContext),
  entry  : Util.webpackEntries(),
  output : {
    path         : path.join(__dirname, 'dist'),
    filename     : '[name].js',
    chunkFilename: '[id].[chunkhash].js',
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
      }
    ]
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      append  : ''
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

webpackConfig.output.publicPath = 'http://brainpal.dev/';
webpackConfig.module.loaders.push({
                                    test  : /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                    loader: 'url-loader?limit=10000000&name=[path][name].[ext]'
                                  });

module.exports  = validator(webpackConfig);
