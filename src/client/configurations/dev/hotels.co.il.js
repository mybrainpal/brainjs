/**
 * Proudly created by ohad on 01/01/2017.
 */
const _                = require('../../common/util/wrapper'),
      Play             = require('../../play'),
      Factory          = require('../../common/events/factory'),
      IdleEvent        = require('../../common/events/idle'),
      GalleryInterface = require('../../manipulation/execute/media/gallery/interface'),
      Executor         = require('../../manipulation/execute/master'),
      StyleExecutor    = require('../../manipulation/execute/dom/style'),
      MoveExecutor     = require('../../manipulation/execute/dom/move'),
      RemoveExecutor   = require('../../manipulation/execute/dom/remove'),
      EventExecutor    = require('../../manipulation/execute/interaction/event'),
      AlertifyExecutor = require('../../manipulation/execute/interface/alertify'),
      TyperExecutor    = require('../../manipulation/execute/interface/typer'),
      SwalExecutor     = require('../../manipulation/execute/interface/sweetalert');
const configuration    = {
  storage    : {
    name: 'console'
  },
  experiments: [
    {
      experiment: {
        id    : 1,
        label : 'magic',
        groups: [
          {
            label    : 'single',
            executors: [
              {
                name   : StyleExecutor.name,
                options: {
                  css: require('./hotels.co.il.css')
                }
              },
              {
                name   : MoveExecutor.name,
                options: {target: '.formsearch', parentSelector: 'ul.bg_blue'}
              },
              {
                name   : RemoveExecutor.name,
                options: {
                  targets: ['#content .share', '#content>br',
                            '#content div.address', '.comments_deal_text']
                }
              },
              {
                name   : MoveExecutor.name,
                options: {
                  target             : '#content h1:first-child',
                  nextSiblingSelector: '#menu'
                }
              },
              {
                name   : MoveExecutor.name,
                options: {
                  target        : '#other_dates_by_res',
                  parentSelector: 'div.more_option div.date'
                }
              },
              {
                name   : MoveExecutor.name,
                options: {
                  target        : '#content .hotel_phone',
                  parentSelector: '.group_sale_info'
                }
              },
              {
                name   : MoveExecutor.name,
                options: {
                  target        : '.TotalRating:first-of-type',
                  parentSelector: '.group_sale_info', copy: true
                }
              },
              {
                name   : GalleryInterface.name,
                options: {
                  container      : '.group_sale_image',
                  sourceSelectors: ['.group_sale_image>img', '#gallery img'],
                  animationClass : 'fxSoftPulse'
                }
              },
              {
                name   : RemoveExecutor.name,
                options: {
                  targets: ['.group_sale_image>img'],
                  on     : GalleryInterface.readyEvent()
                }
              },
              {
                name   : TyperExecutor.name,
                options: {
                  typerFn: function (typer) {
                    document.querySelector('.hotel_deal h2').textContent = '';
                    setTimeout(() => {
                      typer('.hotel_deal h2', 40)
                        .cursor({blink: 'soft'})
                        .line('מבצע סופ"ש 2 לילות במלון דיוויד ים המלח!!',
                              25)
                        .pause(500)
                        .emit('brainpal-title-1')
                        .listen('brainpal-price-1')
                        .continue(' מחיר טוב לא?')
                        .pause(1500)
                        .continue(' לא מספיק!')
                        .pause(500)
                        .emit('brainpal-title-2')
                        .listen('brainpal-price-done')
                        .back(23, 10)
                        .continue(' רק 473 ש״ח לאדם בחדר דלוקס. ')
                        .continue('וכמעט שכחנו... ')
                        .pause(1000)
                        .continue(' הופעה של טוביה צפיר!')
                        .emit('brainpal-title-done')
                        .pause(200)
                        .end();
                    }, 500);
                    setTimeout(() => {
                      document.querySelector('#PriceView').textContent =
                        '';
                      document.querySelector('#PriceView').style.color =
                        'red';
                      typer('#PriceView').listen('brainpal-title-1')
                                         .cursor({blink: 'soft'})
                                         .line('₪2499')
                                         .emit('brainpal-price-1')
                                         .listen('brainpal-title-2')
                                         .back(10, 10)
                                         .run(function (elem) {
                                           elem.style.color = '';
                                         })
                                         .pause(500)
                                         .continue('₪1890').pause(1500)
                                         .emit('brainpal-price-done').end();
                    });
                  }
                }
              },
              {
                name   : SwalExecutor.name,
                options: {
                  on    : true,
                  swalFn: function (swal) {
                    swal({
                           title             : 'עדיין מתלבט..',
                           type              : 'info',
                           text              : 'נציג שלנו ישמח לדבר איתך',
                           timer             : 10000,
                           confirmButtonColor: '#fbc97f',
                           showCloseButton   : true,
                           confirmButtonText : 'חייג עכשיו'
                         }).catch(swal.noop);
                  }
                }
              },
              {
                name   : AlertifyExecutor.name,
                options: {
                  on        : true,
                  alertifyFn: function (alertify) {
                    alertify.set('notifier', 'position', 'bottom-left');
                    alertify.notify('מה אומרים על המלון הזה', 'title', 200);
                    setTimeout(() => {
                      alertify.notify(_reviewToAlertify(0), 'review', 200);
                    }, 1000);
                    setTimeout(() => {
                      alertify.notify('וזו לא הביקורת היחידה', 'title', 200);
                    }, 2000);
                    setTimeout(() => {
                      alertify.notify(_reviewToAlertify(1), 'review', 200);
                    }, 2500);
                    setTimeout(() => {
                      alertify.notify('ויש יותר ממאה כאלו...', 'title', 200);
                    }, 3500);
                    setTimeout(() => {
                      alertify.dismissAll();
                      _.trigger('brainpal-alertify-dismiss');
                    }, 8500);
                  },
                  rtl       : true
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen: {event: 'brainpal-title-done'},
                  create: {
                    event  : 'idle',
                    options: {
                      waitTime  : 5000,
                      detailOrId: 'reviews'
                    }
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen : {
                    event     : Factory.eventName(IdleEvent.name()),
                    detailOrId: 'reviews'
                  },
                  trigger: {
                    event: Executor.eventName(AlertifyExecutor.name)
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen: {event: 'brainpal-alertify-dismiss'},
                  create: {
                    event  : 'idle',
                    options: {
                      waitTime  : 5000,
                      detailOrId: 'modal'
                    }
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen : {
                    event     : Factory.eventName(IdleEvent.name()),
                    detailOrId: 'modal'
                  },
                  trigger: {
                    event: Executor.eventName(SwalExecutor.name)
                  }
                }
              }
            ]
          }
        ]
      },
      options   : {
        subjectOptions: {
          dataProps: [
            {
              name    : 'price',
              selector: '#PriceView'
            },
          ],
          anchor   : {
            selector: '.button_res',
            event   : 'click'
          }
        }
      }
    }
  ]
};

function _reviewToAlertify(index) {
  let content = document.querySelectorAll('.deals_in').item(index).cloneNode(true);
  let rating  = document.querySelector(
    `.TotalRating:nth-of-type(${index + 2})`).childNodes[0].textContent.trim();
  let wrapper = document.createElement('div');
  wrapper.classList.add('TotalRating');
  wrapper.textContent = rating;
  content.appendChild(wrapper);
  return content;
}

Play(configuration);