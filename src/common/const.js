/**
 * Proudly created by ohad on 27/01/2017.
 */
/**
 * Relative path from project root to client code.
 * @type {string}
 */
exports.CLIENT_CONTEXT = './src/client';
/**
 * Name of customer's configurations directory.
 * @type {string}
 */
exports.CUSTOMER_CONFIGS_DIR = 'configurations';
/**
 * Name of directory that shouldn't exist, and can be used in tests.
 * @type {string}
 */
exports.TEST_CONTEXT = './tmp_test';
/**
 * Name of public dir.
 * @type {string}
 */
exports.DIST_DIR = 'dist';
/**
 * Alias for BrainPal production assets.
 * @type {string}
 */
exports.PRODUCTION_ALIAS = '//cdn.brainpal.io/dist/';
/**
 * Alias for BrainPal staging assets.
 * @type {string}
 */
exports.STAGING_ALIAS = '//staging.brainpal.io/dist/';
/**
 * Alias for local BrainPal assets.
 * @type {string}
 */
exports.LOCAL_ALIAS = '//brainjs.dev/';
/**
 * Alias for local publisher.
 * @type {string}
 */
exports.LOCAL_PUBLISHER = 'publisher.dev';
/**
 * Localhost port of Node apps.
 * @type {number}
 */
exports.LOCAL_PORT = 3000;
/**
 * for process.env.NODE_ENV
 * @type {Object}
 */
exports.ENV = Object.freeze({
                              PROD   : 'production',
                              DEV    : 'development',
                              STAGING: 'staging',
                              TEST   : 'test'
                            });
/**
 * Google Cloud project ID.
 * @type {string}
 */
exports.PROJECT_ID = 'nth-name-156816';
/**
 * Google Cloud staging project ID.
 * @type {string}
 */
exports.STAGING_PROJECT_ID = 'brainjs-staging';
/**
 * Name of staging storage bucket.
 * @type {string}
 */
exports.STAGING_BUCKET = 'staging.brainpal.io';
/**
 * Name of production storage bucket.
 * @type {string}
 */
exports.PRODUCTION_BUCKET = 'cdn.brainpal.io';
/**
 * Node app's storage route.
 * @type {string}
 */
exports.PRODUCTION_STORAGE = 'https://nth-name-156816.appspot.com/save';
/**
 * Staging Node app's storage route.
 * @type {string}
 */
exports.STAGING_STORAGE = 'https://dashboard-161017.appspot.com';
/**
 * Local Node app's storage route.
 * @type {string}
 */
exports.LOCAL_STORAGE = `http://localhost:${exports.LOCAL_PORT}/save`;
/**
 * Backend URL path to handle various messages types.
 * @type {Object}
 */
exports.BACKEND_URL = Object.freeze({
                                      LOG   : 'log/add',
                                      EVENT : 'event/add',
                                      CLIENT: 'client/init',
                                      UPDATE: 'client/update'
                                    });
/**
 * Types of non-native events, such as participation in an experiment.
 * @type {Object}
 */
exports.EVENTS = Object.freeze({
                                 PARTICIPATE: 'PARTICIPATE'
                               });
/**
 * Types of predefined session states.
 * @type {Object}
 */
exports.STATES = Object.freeze({
                                 CONVERSION: 'CONVERSION'
                               });
