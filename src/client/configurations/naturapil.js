/**
 * Proudly created by ohad on 11/03/2017.
 */
const Play              = require('../play'),
      Factory           = require('../common/events/factory'),
      IdleEvent         = require('../common/events/idle'),
      Master            = require('../manipulation/execute/master'),
      EventExecutor     = require('../manipulation/execute/interaction/event'),
      AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      TooltipInterface  = require('../manipulation/execute/dom/tooltip/interface'),
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
              label    : 'gift',
              executors: [
                {
                  name   : StyleExecutor.name,
                  options: {css: require('./alertify.css')}
                },
                {
                  name   : StyleExecutor.name,
                  options: {
                    css: `.alertify-notifier.ajs-left .ajs-message.ajs-visible
                                  {direction: rtl; background-color : #2200FF; left: 240px !important;}`
                  }
                },
                {
                  name   : AlertifyInterface.name,
                  options: {
                    alertifyFn: (alertify) => {
                      alertify.set('notifier', 'position', 'bottom-left');
                      alertify.notify('מתנה למי שמפנה חבר או חברה!', 'message', 10);
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {
        experiment: {
          id          : 2,
          label       : 'attention',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 800}],
          groups      : [
            {
              label    : 'remove header',
              executors: [
                {
                  name   : StyleExecutor.name,
                  options: {css: `.top-nav {display:none}`}
                }
              ]
            }
          ]
        }
      },
      {
        experiment: {
          id          : 2,
          label       : 'tooltip',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 800}],
          groups      : [
            {
              label    : 'tooltip',
              executors: [
                {
                  name   : TooltipInterface.name,
                  options: {
                    type       : 'bloated',
                    id         : 'bpal',
                    timer      : 5000,
                    target     : 'h3',
                    htmlContent: 'המבצע עומד להסתיים'
                  }
                },
                {
                  name   : StyleExecutor.name,
                  options: {
                    css: `
                      #${TooltipInterface.tooltipId('bpal')}>span{
                        direction: rtl; padding: 20px 20px;}`

                  }
                },
                {
                  name   : EventExecutor.name,
                  options: {
                    create: {
                      event  : IdleEvent.name(),
                      options: {
                        waitTime  : 1000,
                        detailOrId: 'tooltip'
                      }
                    }
                  }
                },
                {
                  name   : EventExecutor.name,
                  options: {
                    listen : {
                      event     : Factory.eventName(IdleEvent.name()),
                      detailOrId: 'tooltip'
                    },
                    trigger: {
                      event: Master.eventName(TooltipInterface.name)
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
