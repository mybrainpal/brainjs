/**
 * Proudly created by ohad on 10/02/2017.
 */
const Const = require('./const');
/**
 * @returns {Object} config variables for the environment.
 */
module.exports = (function () {
  if (process.env.NODE_ENV === Const.ENV.STAGING) {
    return {
      publicPath: Const.STAGING_ALIAS,
      bucket    : Const.STAGING_BUCKET
    };
  }
  if (process.env.NODE_ENV === Const.ENV.PROD) {
    return {
      publicPath: Const.PRODUCTION_ALIAS,
      bucket    : Const.PRODUCTION_BUCKET,
      uglify    : true
    };
  }
  return {publicPath: Const.LOCAL_ALIAS};
})();