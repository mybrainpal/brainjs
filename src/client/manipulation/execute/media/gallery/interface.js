/**
 * Proudly created by ohad on 16/01/2017.
 */
const Master = require('../../master');
exports.name = 'gallery';
Master.register(exports);
/**
 * A prefix to all galleries.
 * @type {string}
 */
exports.idPrefix = 'brainpal-gallery';
/**
 * Interface for GalleryExecutor.
 * @param {Object} options
 */
exports.execute = function (options) {
  require.ensure('./gallery', function (require) {
    const impl = require('./gallery');
    impl.preconditions(options);
    impl.execute(options);
  });
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {};
