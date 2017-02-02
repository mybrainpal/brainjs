/**
 * Proudly created by ohad on 27/01/2017.
 */
const path      = require('path'),
      glob      = require('glob'),
      Constants = require('./const');

/**
 * @param {string} [subPath] - sub path within the configurations dir (such as 'dev')
 * @returns {Object} entry per customer for the webpack config.
 */
exports.webpackEntries = function (subPath) {
  const configurationFiles = glob.sync(
    path.join(Constants.clientContext, Constants.configurationDir, subPath || '') + '/**/*.js');
  let entries              = {};
  for (let i = 0; i < configurationFiles.length; i++) {
    entries[path.basename(configurationFiles[i], '.js')] = './' + path.join(
        Constants.configurationDir, subPath || '', path.basename(configurationFiles[i]));
  }
  return entries;
};