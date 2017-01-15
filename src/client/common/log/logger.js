/**
 * Proudly created by ohad on 04/12/2016.
 */
let _        = require('./../../common/util/wrapper'),
    Storage  = require('../storage/storage');

exports.Level = Object.freeze({
                                  FINE   : {value: 0, name: 'Fine'},
                                  INFO   : {value: 1, name: 'Info'},
                                  WARNING: {value: 2, name: 'Warning'},
                                  ERROR  : {value: 3, name: 'Error'},
                                  FATAL  : {value: 4, name: 'Fatal'}
                              });

/**
 * Logs msg onto storage.
 * @param {Object} level - severity of the log.
 * @param {Object} message
 */
exports.log = function (level, message) {
    let subject = {
        level: level.name.toUpperCase(),
        type : 'log'
    };
    if (_.isString(message)) {
        subject.content = message
    } else {
        _.deepExtend(subject, message);
    }
    Storage.save(subject);
};
