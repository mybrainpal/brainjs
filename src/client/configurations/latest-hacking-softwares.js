/**
 * Proudly created by ohad on 08/02/2017.
 */
const Play              = require('../play'),
      AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      MoveExecutor      = require('../manipulation/execute/dom/move'),
      StyleExecutor     = require('../manipulation/execute/dom/style'),
      Demographics      = require('../manipulation/experiment/demographics'),
      Storage           = require('../common/storage/storage');

const configuration = {
  storage    : {
    name   : Storage.names.GOOGLE_ANALYTICS,
    options: {
      trackingId: 'UA-91064115-3'
    }
  },
  experiments: [
    {
      experiment: {
        id          : 2,
        label       : 'second CTA',
        groups      : [
          {
            label       : 'experiment',
            demographics: [
              {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [2], moduloOf: 5}
            ],
            executors   : [
              {
                name   : MoveExecutor.name,
                options: {
                  copy               : true,
                  target             : 'a[href*=alinks]',
                  nextSiblingSelector: 'div.header-content div.clear'
                }
              },
              {
                name   : StyleExecutor.name,
                options: {
                  css: `.brainpal-copy {position: absolute; right: 100px}`
                }
              }
            ]
          }
        ],
        demographics: [
          {name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 770},
          {
            name: Demographics.PROPERTIES.URL.name,
            url : /^https?:\/\/(?:www\.)?latesthackingsoftwares\.com\/[^\/]+\/?(?:\?lang=[a-z]+)?$/
          },
          {name: Demographics.PROPERTIES.BROWSER.name, browser: 'chrome'}
        ]
      },
      options   : {
        subjectOptions: {
          anchor   : {
            selector: 'a[href*=alinks]',
            event   : 'click'
          },
          dataProps: [{name: 'install', selector: 'h1.name span[itemprop=name]'}]
        }
      }
    },
    {
      experiment: {
        id          : 2,
        label       : 'alertify',
        groups      : [
          {
            label       : 'downloads',
            demographics: [
              {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [1], moduloOf: 5}
            ],
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./latest-hacking-softwares.css')}},
              {
                name   : AlertifyInterface.name,
                options: {
                  alertifyFn: (alertify) => {
                    alertify.set('notifier', 'position', 'bottom-left');
                    alertify.notify(
                      Math.round(50 + Math.random() * 120) + ' downloads in the last hour.',
                      'message', 10);
                  }
                }
              }
            ]
          }
        ],
        demographics: [
          {name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 770},
          {
            name: Demographics.PROPERTIES.URL.name,
            url : /^https?:\/\/(?:www\.)?latesthackingsoftwares\.com\/[^\/]+\/?(?:\?lang=[a-z]+)?$/
          },
          {name: Demographics.PROPERTIES.BROWSER.name, browser: 'chrome'}
        ]
      },
      options   : {
        subjectOptions: {
          anchor   : {
            selector: 'a[href*=alinks]',
            event   : 'click'
          },
          dataProps: [{name: 'install', selector: 'h1.name span[itemprop=name]'}]
        }
      }
    },
    {
      experiment: {
        id          : 3,
        label       : 'both',
        groups      : [
          {
            label       : 'both',
            demographics: [
              {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 5}
            ],
            executors   : [
              {name: StyleExecutor.name, options: {css: require('./latest-hacking-softwares.css')}},
              {
                name   : AlertifyInterface.name,
                options: {
                  alertifyFn: (alertify) => {
                    alertify.set('notifier', 'position', 'bottom-left');
                    alertify.notify(
                      Math.round(50 + Math.random() * 120) + ' downloads in the last hour.',
                      'message', 10);
                  }
                }
              },
              {
                name   : MoveExecutor.name,
                options: {
                  copy               : true,
                  target             : 'a[href*=alinks]',
                  nextSiblingSelector: 'div.header-content div.clear'
                }
              },
              {
                name   : StyleExecutor.name,
                options: {
                  css: `.brainpal-copy {position: absolute; right: 100px}`
                }
              }
            ]
          }
        ],
        demographics: [
          {name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 770},
          {
            name: Demographics.PROPERTIES.URL.name,
            url : /^https?:\/\/(?:www\.)?latesthackingsoftwares\.com\/[^\/]+\/?(?:\?lang=[a-z]+)?$/
          },
          {name: Demographics.PROPERTIES.BROWSER.name, browser: 'chrome'}
        ]
      },
      options   : {
        subjectOptions: {
          anchor   : {
            selector: 'a[href*=alinks]',
            event   : 'click'
          },
          dataProps: [{name: 'install', selector: 'h1.name span[itemprop=name]'}]
        }
      }
    }
  ]
};

Play(configuration);