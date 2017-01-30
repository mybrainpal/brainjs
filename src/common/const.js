/**
 * Proudly created by ohad on 27/01/2017.
 */
/**
 * Relative path from project root to client code.
 * @type {string}
 */
exports.clientContext = './src/client';

/**
 * Name of customer's configurations directory.
 * @type {string}
 */
exports.configurationDir = 'configurations';

/**
 * Name of directory that shouldn't exist, and can be used in tests.
 * @type {string}
 */
exports.testContext = './tmp_test';

/**
 * Name of public dir.
 * @type {string}
 */
exports.publicDir = 'dist';

/**
 * Alias for BrainPal Node app.
 * @type {string}
 */
exports.productionPublicPath = 'http://cdn.brainpal.io/';

/**
 * Alias for local BrainPal Node app.
 * @type {string}
 */
exports.localPublicPath = 'http://brainjs.dev/';
/**
 * Name of sub directory for dev dist (webpack output) files.
 * @type {string}
 */
exports.devDistDir = 'dev';