'use strict';
const webpack = require('webpack'),
      glob = require('glob'),
      path    = require('path');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';
const relativeContext = './src/client';

let webpackConfig = {
  context: path.join(__dirname, relativeContext),
  entry  : entries(),
  output : {
    path         : path.join(__dirname, 'dist'),
    publicPath   : 'http://brainpal.dev/',
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

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress : {
      warnings: false
    }
  }));
  webpackConfig.plugins.push(new webpack.optimize.MinChunkSizePlugin({minChunkSize: 50000}));
  webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
  webpackConfig.module.loaders.push({
                                      test  : /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                      loader: 'url-loader?limit=10000&name=[path][name].[ext]'
                                    });
  webpackConfig.output.publicPath = 'https://mybrainpal.herokuapp.com/';
} else {
  webpackConfig.module.loaders.push({
                                      test  : /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                      loader: 'url-loader?limit=10000000&name=[path][name].[ext]'
                                    });
}

/**
 * @returns {Object} entry per customer for the webpack config.
 */
function entries() {
  const configurationsSubpath = 'configurations';
  const configurationFiles    = glob.sync(
    path.join(relativeContext, configurationsSubpath) + '/*.js');
  let entries                 = {};
  for (let i = 0; i < configurationFiles.length; i++) {
    entries[path.basename(configurationFiles[i], '.js')] =
      './' + path.join(configurationsSubpath, path.basename(configurationFiles[i]));
  }
  return entries;
}

module.exports = webpackConfig;
