/**
 * Proudly created by ohad on 28/01/2017.
 */
const Play          = require('../play'),
      Demographics  = require('../manipulation/experiment/demographics'),
      StyleExecutor = require('../manipulation/execute/dom/style'),
      Const         = require('../../common/const'),
      Storage       = require('../common/storage/storage');

const configuration = {
  storage   : {
    name: Storage.names.POST,
  },
  tracker   : 3,
  experiment: {
    id          : 10,
    demographics: {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 2},
    groups      : {
      id          : 9,
      demographics: {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 3},
      executors   : {
        name   : StyleExecutor.name,
        options: {
          css: `#topnav>ul>li:last-child>a {color: #999 !important; background:#fff !important}
                #topnav>ul>li:last-child>a:hover {
                  color: #666 !important; background:#eee !important}`
        }
      }
    },
    collect     : {
      event: 'click', selector: '#navCallToAction', state: Const.STATES.CONVERSION
    }
  }
};

Play(configuration);