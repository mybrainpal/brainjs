/**
 * Proudly created by ohad on 04/12/2016.
 */
let _       = require('./../../common/util/wrapper'),
    Storage = require('../storage/storage'),
    Const   = require('../../../common/const');

exports.Level = Object.freeze({
                                FINE   : {value: 0, name: 'FINE'},
                                INFO   : {value: 1, name: 'INFO'},
                                WARNING: {value: 2, name: 'WARNING'},
                                ERROR  : {value: 3, name: 'ERROR'},
                                FATAL  : {value: 4, name: 'FATAL'}
                              });

/**
 * Logs msg onto storage.
 * @param {Object} level - severity of the log.
 * @param {Object} message
 */
exports.log = function (level, message) {
  let subject = {
    level: level.name,
    kind : Const.KIND.LOG
  };
  if (_.isString(message)) {
    subject.message = message;
  } else {
    _.deepExtend(subject, message);
  }
  Storage.save(subject);
};
