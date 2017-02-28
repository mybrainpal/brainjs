/**
 * Proudly created by ohad on 27/01/2017.
 */
const path      = require('path'),
      glob      = require('glob'),
      Constants = require('./const');

/**
 * @returns {Object} entry per customer for the webpack config.
 */
exports.webpackEntries = function () {
  const configurationFiles = glob.sync(
    path.join(Constants.CLIENT_CONTEXT, Constants.CUSTOMER_CONFIGS_DIR) + '/*.js');
  let entries              = {};
  for (let i = 0; i < configurationFiles.length; i++) {
    entries[path.basename(configurationFiles[i], '.js')] = './' + path.join(
        Constants.CUSTOMER_CONFIGS_DIR, path.basename(configurationFiles[i]));
  }
  return entries;
};
