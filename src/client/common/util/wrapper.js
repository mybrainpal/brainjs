/**
 * Proudly created by ohad on 20/12/2016.
 */
let _ = require('./prototype');
_.css = require('./style');
_.deepExtend(_, require('./dom'));
_.http = require('./ajax');
module.exports = _;