/**
 * Proudly created by ohad on 28/01/2017.
 */
const _                 = require('../common/util/wrapper'),
      AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      StyleExecutor     = require('../manipulation/execute/dom/style'),
      Storage           = require('../common/storage/storage'),
      Logger            = require('../common/log/logger'),
      Level             = require('../common/log/logger').Level,
      Demographics = require('../manipulation/experiment/demographics'),
      Play              = require('../play');

const configuration = {
  storage    : {
    name   : Storage.names.GOOGLE_ANALYTICS,
    options: {
      trackingId: 'UA-91064115-2'
    }
  },
  experiments: [
    {
      experiment: {
        id    : 1,
        label : 'alertify',
        groups: [
          {
            label       : 'downloaded',
            demographics: {
              properties: [{
                name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 10
              }]
            },
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.css')}},
              {
                name   : AlertifyInterface.name,
                options: {alertifyFn: _createFn('27 downloaded in the last hour.')}
              }
            ]
          }
        ]
      },
      options   : {
        subjectOptions: {
          anchor: {
            selector: 'a.button',
            event   : 'click'
          }
        }
      }
    }
  ],

};

function _createFn(msg) {
  return (alertify) => {
    alertify.set('notifier', 'position', 'bottom-left');
    alertify.notify(msg, 'message', 10);
    setTimeout(() => {
      if (_.isVisible(document.querySelector('div.ajs-visible'))) {
        Logger.log(Level.INFO, 'Configuration: alertify visible');
      } else {
        Logger.log(Level.WARNING, 'Configuration: alertify not visible');
      }
    }, 100)
  }
}

Play(configuration);
