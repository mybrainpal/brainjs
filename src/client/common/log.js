/**
 * Proudly created by ohad on 02/12/2016.
 */
'use strict';

/**
 * A communication interface to store data in an external data warehouse. The interface is often
 * implemented by integrations (i.e. {@link GoogleAnalyticsLogger}).
 * @param options
 * @constructor
 */
function Logger(options) {
    this.options(options);
}

/**
 * Logs an entry on subject.
 * @param {Object} subject
 */
Logger.prototype.log = function(subject) {};