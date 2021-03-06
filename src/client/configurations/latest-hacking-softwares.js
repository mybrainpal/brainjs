/**
 * Proudly created by ohad on 05/03/2017.
 */
const Play          = require('../play'),
      MoveExecutor  = require('../manipulation/execute/dom/move'),
      StyleExecutor = require('../manipulation/execute/dom/style'),
      Demographics  = require('../manipulation/experiment/demographics'),
      Storage       = require('../common/storage/storage');

const configuration = {
  storage    : {
    name: Storage.names.POST,
  },
  tracker    : 100,
  experiments: [
    {
      experiment: {
        id          : 1,
        label       : 'second CTA',
        groups      : [
          {
            id          : 1,
            label       : 'experiment',
            demographics: [
              {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 5}
            ],
            executors   : [
              {
                name   : MoveExecutor.name,
                options: {
                  copy               : true,
                  target             : 'a[href*=blinks]',
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
        anchor   : {
          selector: 'a[href*=blinks]',
          event   : 'click'
        },
        dataProps: [{name: 'install', selector: 'h1.name span[itemprop=name]'}]
      }
    },
  ]
};

Play(configuration);