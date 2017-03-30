/**
 * Proudly created by ohad on 20/12/2016.
 */
let _ = require('./prototype');
_.extend(_, require('./dom'));
_.extend(_, require('./http'));
module.exports = _;