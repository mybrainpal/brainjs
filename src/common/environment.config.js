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
      projectId   : Const.STAGING_PROJECT_ID,
      publicPath  : Const.STAGING_ALIAS,
      bucket      : Const.STAGING_BUCKET,
      storageRoute: Const.STAGING_STORAGE
    };
  }
  if (process.env.NODE_ENV === Const.ENV.PROD) {
    return {
      projectId   : Const.PROJECT_ID,
      publicPath  : Const.PRODUCTION_ALIAS,
      bucket      : Const.PRODUCTION_BUCKET,
      uglify      : true,
      storageRoute: Const.PRODUCTION_STORAGE
    };
  }
  return {
    publicPath  : Const.LOCAL_ALIAS,
    storageRoute: Const.LOCAL_STORAGE
  };
})();