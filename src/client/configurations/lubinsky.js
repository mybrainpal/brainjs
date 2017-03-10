/**
 * Proudly created by ohad on 10/03/2017.
 */
const Play              = require('../play'),
      AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      StyleExecutor     = require('../manipulation/execute/dom/style'),
      Demographics      = require('../manipulation/experiment/demographics'),
      Storage           = require('../common/storage/storage');

// Let the games begin.
Play(
  {
    storage    : {
      name: Storage.names.CONSOLE
    },
    experiments: [
      {
        experiment: {
          id          : 1,
          label       : 'alertify',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 800}],
          groups      : [
            {
              label    : 'watching',
              executors: [
                {
                  name   : StyleExecutor.name,
                  options: {css: require('./alertify.css')}
                },
                {
                  name   : StyleExecutor.name,
                  options: {
                    css: `.alertify-notifier.ajs-left .ajs-message.ajs-visible
                                  {direction: rtl; background-color : #f11010}`
                  }
                },
                {
                  name   : AlertifyInterface.name,
                  options: {
                    alertifyFn: (alertify) => {
                      alertify.set('notifier', 'position', 'bottom-left');
                      alertify.notify('38 התקשרו בשעה האחרונה', 'message', 10);
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  });