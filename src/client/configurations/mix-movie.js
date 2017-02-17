/**
 * Proudly created by ohad on 13/02/2017.
 */
const AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      StyleExecutor     = require('../manipulation/execute/dom/style'),
      Storage           = require('../common/storage/storage'),
      Demographics      = require('../manipulation/experiment/demographics'),
      Play              = require('../play');

const configuration = {
  storage    : {
    name   : Storage.names.GOOGLE_ANALYTICS,
    options: {
      trackingId: 'UA-91064115-4'
    }
  },
  experiments: [
    {
      experiment: {
        id    : 1,
        label : 'alertify',
        groups: [
          {
            label       : 'watching',
            demographics: [{
              name: Demographics.PROPERTIES.MODULO.name, moduloIds: [1], moduloOf: 5
            }],
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./alertify.css')}},
              {
                name   : AlertifyInterface.name,
                options: {
                  alertifyFn: _createFn(Math.round(5 + Math.random() * 30) +
                                        ' are watching now.')
                }
              }
            ]
          },
          {
            label       : 'no-menu',
            demographics: [{
              name: Demographics.PROPERTIES.MODULO.name, moduloIds: [2], moduloOf: 10
            }],
            executors   : [
              {name: StyleExecutor.name, options: {css: 'nav{display:none}'}},
            ]
          },
          {
            label       : 'no-footer',
            demographics: [{
              name: Demographics.PROPERTIES.MODULO.name, moduloIds: [3], moduloOf: 10
            }],
            executors   : [
              {name: StyleExecutor.name, options: {css: '.categories{display:none}'}},
            ]
          },
          {
            label       : 'combined',
            demographics: [{
              name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 10
            }],
            executors   : [
              {name: StyleExecutor.name, options: {css: 'nav,.categories{display:none}'}},
              {name: StyleExecutor.name, options: {css: require('./alertify.css')}},
              {
                name   : AlertifyInterface.name,
                options: {
                  alertifyFn: _createFn(Math.round(5 + Math.random() * 30) +
                                        ' are watching now.')
                }
              }
            ]
          }
        ]
      },
      options   : {
        anchor: {
          selector: 'a.modal-button.install-button',
          event   : 'click'
        }
      }
    }
  ],

};

function _createFn(msg) {
  return (alertify) => {
    alertify.set('notifier', 'position', 'bottom-left');
    alertify.notify(msg, 'message', 10);
  }
}

Play(configuration);