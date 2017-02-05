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
            label       : 'red-shirt',
            demographics: {properties: [{name: 'modulo', moduloIds: [1, 10], moduloOf: 20}]},
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.2.css')}},
              {
                name   : InjectExecutor.name,
                options: {
                  target  : '.preland',
                  html    : `<div id='brainpal-look-up'><img
src='https://storage.googleapis.com/nth-name-156816.appspot.com/experiment/private-search/look-up-red-shirt.jpg' onload='brainpalLoad("#f6f6f6", true)'></div>`,
                  position: 'beforeEnd'
                }
              }
            ]
          },
          {
            label       : 'blond-suit',
            demographics: {properties: [{name: 'modulo', moduloIds: [0, 11], moduloOf: 20}]},
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./private-search.2.css')}},
              {
                name   : InjectExecutor.name,
                options: {
                  target  : '.preland',
                  html    : `<div id='brainpal-look-up'><img
src='https://storage.googleapis.com/nth-name-156816.appspot.com/experiment/private-search/look-up-blond-suit.jpg' onload='brainpalLoad("white", true)'></div>`,
                  position: 'beforeEnd'
                }
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

window.brainpalLoad = function (backgroundColor, center = false) {
  try {
    const div        = document.querySelector('#brainpal-look-up');
    const preland    = document.querySelector('.preland');
    const img        = div.querySelector('img');
    const rect       = document.querySelector('.pre-content').getBoundingClientRect();
    img.style.height = window.innerHeight - 40 - rect.top - rect.height;
    if (center) {
      div.style.display        = 'flex';
      div.style.justifyContent = 'center';
      img.style.left           = div.querySelector('img').style.right = 'auto';
    }
    preland.style.backgroundColor = document.body.style.backgroundColor = backgroundColor;
    document.body.appendChild(div.cloneNode(true));
    document.querySelector('a.button').addEventListener('click', function () {
      div.style.display = 'none';
    });
    div.style.opacity = '1';
  } catch (e) {
    Logger.log(Level.WARNING, 'Failed to expose look up image - ' + e.message);
  }
};

Play(configuration);
