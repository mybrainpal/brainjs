/**
 * Proudly created by ohad on 12/03/2017.
 */
const Play              = require('../play'),
      EventExecutor     = require('../manipulation/execute/interaction/event'),
      AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      TyperInterface    = require('../manipulation/execute/interface/typer'),
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
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, maxWidth: 1100}],
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
                                  {direction: rtl;
                                   background-color : #333399;
                                    left: 210px !important; 
                                    font-size        : 3em;}`
                  }
                },
                {
                  name   : AlertifyInterface.name,
                  options: {
                    alertifyFn: (alertify) => {
                      alertify.set('notifier', 'position', 'bottom-left');
                      alertify.notify('118 הלוואות ב24 שעות האחרונות', 'message', 10);
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
          label       : 'call on click',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, maxWidth: 1100}],
          groups      : [
            {
              label    : 'remove header',
              executors: [
                {
                  name   : EventExecutor.name,
                  options: {
                    listen  : {event: 'click', target: '.LeadFormContent>div>p:last-child'},
                    callback: () => {
                      window.open("tel:+972723902499");
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
          id          : 3,
          label       : 'typer',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, maxWidth: 1100}],
          groups      : [
            {
              label    : 'story',
              executors: [
                {
                  name   : StyleExecutor.name,
                  options: {
                    css: `.typer {font-size: 1.4em; color: #333399}`
                  }
                },
                {
                  name   : TyperInterface.name,
                  options: {
                    typerFn: (typer) => {
                      const ul = document.querySelector('.LeadFormContent>div>ul');
                      ul.parentNode.removeChild(ul);
                      const obj = typer('.LeadFormContent>div>p', 40)
                        .cursor({blink: 'soft', color: '#333399'});
                      obj.empty().back('all').line('אם אתם צריכים הלוואה..')
                         .pause(500)
                         .line('ויכולים להתחיל להחזיר רק בעוד חצי שנה..')
                         .pause(500)
                         .line('אז יש לנו בדיוק את ההצעה בשבילכם!')
                         .pause(1000)
                         .empty().back('all')
                         .line('מה היא כוללת?')
                         .pause(500)
                         .line('הלוואות עד 60,000 ₪')
                         .pause(1000)
                         .back('הלוואות עד 60,000 ₪'.length)
                         .pause(500)
                         .line('עד 60 תשלומים')
                         .pause(1000)
                         .back('עד 60 תשלומים'.length)
                         .pause(500)
                         .line('ואין צורך בערבים')
                         .pause(1000)
                         .back('all')
                         .end();
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