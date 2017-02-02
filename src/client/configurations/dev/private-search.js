/**
 * Proudly created by ohad on 28/01/2017.
 */
const _                 = require('../../common/util/wrapper'),
      AlertifyInterface = require('../../manipulation/execute/interface/alertify'),
      InjectExecutor = require('../../manipulation/execute/dom/inject'),
      StyleExecutor     = require('../../manipulation/execute/dom/style'),
      Storage           = require('../../common/storage/storage'),
      Logger            = require('../../common/log/logger'),
      Level             = require('../../common/log/logger').Level,
      Play              = require('../../play');

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
            label       : 'question',
            demographics: {properties: [{name: 'modulo', moduloIds: [0, 1], moduloOf: 20}]},
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.css')}},
              {
                name   : AlertifyInterface.name,
                options: {alertifyFn: _createFn('Does your privacy matters to you?')}
              }
            ]
          },
          {
            label       : 'keep',
            demographics: {properties: [{name: 'modulo', moduloIds: [2, 3], moduloOf: 20}]},
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.css')}},
              {
                name   : AlertifyInterface.name,
                options: {alertifyFn: _createFn('Keep your searches to yourself.')}
              }
            ]
          },
          {
            label       : 'free',
            demographics: {properties: [{name: 'modulo', moduloIds: [4, 5], moduloOf: 20}]},
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.css')}},
              {
                name   : AlertifyInterface.name,
                options: {alertifyFn: _createFn('Search stress free.')}
              }
            ]
          },
          {
            label       : 'downloaded',
            demographics: {properties: [{name: 'modulo', moduloIds: [6, 7], moduloOf: 20}]},
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
    },
    {
      experiment: {
        id    : 2,
        label : 'photo',
        groups: [
          {
            label       : 'question',
            demographics: {properties: [{name: 'modulo', moduloIds: [0, 10], moduloOf: 20}]},
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.css')}},
              {
                name   : AlertifyInterface.name,
                options: {alertifyFn: _createFn('Does your privacy matters to you?')}
              }
            ]
          }]
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
