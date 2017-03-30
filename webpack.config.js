'use strict';
const webpack             = require('webpack'),
      path                = require('path'),
      Util                = require('./src/common/util'),
      envConfig           = require('./src/common/environment.config'),
      GoogleStoragePlugin = require('./src/common/google.storage.plugin'),
      Const               = require('./src/common/const');

process.env.NODE_ENV = process.env.NODE_ENV || Const.ENV.DEV;

let webpackConfig = {
  context: path.join(__dirname, Const.CLIENT_CONTEXT),
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
      'process.env.NODE_ENV'    : JSON.stringify(process.env.NODE_ENV),
      'process.env.BACKEND_HOST': JSON.stringify(envConfig.storageRoute)
    }),
    function () {
      this.plugin('watch-run', function (watching, callback) {
        console.log(process.env.NODE_ENV + ' compile at ' + new Date() + ' under ' +
                    webpackConfig.output.publicPath);
        callback();
      })
    }]
};

webpackConfig.entry             = Util.webpackEntries();
webpackConfig.output.path       = path.join(__dirname, Const.DIST_DIR);
webpackConfig.output.publicPath = envConfig.publicPath;
webpackConfig.module.rules.push({
                                  test: /\.(png|svg|woff|jpg|jpeg|gif|wav|mp3)$/,
                                  use : [{
                                    loader: 'url-loader',
                                    query : 'limit=2000000&name=[path][name].[ext]'
                                  }]
                                });
if (envConfig.uglify) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress : {
      warnings: false
    }
  }));
  webpackConfig.plugins.push(new webpack.optimize.MinChunkSizePlugin({minChunkSize: 50000}));
}
if (envConfig.bucket) {
  webpackConfig.plugins.push(new GoogleStoragePlugin({
    directory     : Const.DIST_DIR,
    include       : ['.js', '.js.map'],
    storageOptions: {
      projectId  : Const.PROJECT_ID,
      credentials: require('./credentials/google.credentials.json'),
    },
    uploadOptions : {
      bucketName: envConfig.bucket,
      makePublic: true
    }
  }));
}
module.exports = webpackConfig;
