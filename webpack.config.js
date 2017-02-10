'use strict';
const webpack   = require('webpack'),
      path      = require('path'),
      Util      = require('./src/common/util'),
      Constants = require('./src/common/const');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

let webpackConfig = {
  context: path.join(__dirname, Constants.clientContext),
  output : {
    filename     : '[name].js',
    chunkFilename: '[id].[chunkhash].js',
    pathinfo     : true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css']
  },
  module : {
    rules: [
      {
        test   : /\.js$/,
        exclude: [/node_modules/],
        use    : [{
          loader : 'babel-loader',
          options: {presets: ['es2015']},
        }],
      },
      {
        test   : /\.css$/,
        exclude: [/\.local\.css$/],
        use    : [{
          loader: 'css-loader',
          query : 'sourceMap&modules&importLoaders=1&localIdentName=[local]'
        }, {
          loader: 'sass-loader',
          query : 'sourceMap&localIdentName=[local]'
        }],
      },
      {
        test   : /\.(scss|local\.css)$/,
        exclude: [/node_modules/],
        use    : [{
          loader: 'css-loader',
          query : 'sourceMap&modules&importLoaders=1&localIdentName=[local]--[hash:base64:5]',
        }, {
          loader: 'sass-loader',
          query : 'sourceMap&localIdentName=[local]--[hash:base64:5]',
        }],
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
        console.log(process.env.NODE_ENV + ' compile at ' + new Date() + ' under ' +
                    webpackConfig.output.publicPath);
        callback();
      })
    }]
};

webpackConfig.entry             = Util.webpackEntries(Constants.devDistDir);
webpackConfig.output.path       = path.join(__dirname, Constants.publicDir, Constants.devDistDir);
webpackConfig.output.publicPath = (process.env.NODE_ENV === 'production' ?
                                   Constants.productionPublicPath :
                                   Constants.localPublicPath) + Constants.devDistDir + '/';
if (process.env.NODE_ENV !== 'production') {
  webpackConfig.module.rules.push({
                                    test: /\.(png|svg|woff|jpg|jpeg|gif)$/,
                                    use : [{
                                      loader: 'url-loader',
                                      query : 'limit=10000000&name=[path][name].[ext]'
                                    }]
                                  });
}
module.exports = webpackConfig;
