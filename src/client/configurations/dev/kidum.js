/**
 * Proudly created by ohad on 08/01/2017.
 */
/**
 * Proudly created by ohad on 01/01/2017.
 */
const _                = require('../../common/util/wrapper'),
      Play             = require('../../play'),
      Factory          = require('../../common/events/factory'),
      IdleEvent        = require('../../common/events/idle'),
      WordEvent        = require('../../common/events/word'),
      Executor         = require('../../manipulation/execute/master'),
      StyleExecutor    = require('../../manipulation/execute/dom/style'),
      EventExecutor    = require('../../manipulation/execute/interaction/event'),
      InjectExecutor   = require('../../manipulation/execute/dom/inject'),
      TooltipInterface = require('../../manipulation/execute/dom/tooltip/interface'),
      AlertifyExecutor = require('../../manipulation/execute/interface/alertify'),
      TyperExecutor    = require('../../manipulation/execute/interface/typer'),
      SwalExecutor     = require('../../manipulation/execute/interface/sweetalert');
const configuration    = {
  storage    : {
    name: 'local'
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
                  css: `
                                        [class^='form'] {display: none}
                                        [class^='swal2'] { direction: rtl}
                                        [class^='ajs'] { direction: rtl}
                                        input.brainpal {
                                            background-color: #fff;
                                            color: #DC191F;
                                            box-shadow: inset 2px 2px 5px #adabac;
                                            width: 70%;
                                            max-width: 300px;
                                            box-sizing: border-box;
                                            padding: 3px;
                                            font-size: 1.8em;
                                            font-weight: 100;
                                            font-family: arial;
                                            direction: rtl;
                                            text-align: right;
                                            border-radius: 10px;
                                            border: 2px solid #fbfbfb;
                                            outline: none;
                                        }
                                        div.brainpal span.typer {
                                            font-size: 1.8em;
                                            color: #DC191F;
                                        }
                                        div.brainpal .white-space {
                                            transition: opacity 400ms;
                                            z-index: 10000
                                        }
                                        div.brainpal {
                                            text-align: center;
                                            direction: rtl;
                                            height: 2em;
                                            margin-bottom:10px;
                                        }
                                        .alertify-notifier.ajs-left .ajs-message.ajs-visible {
                                            right: 320px !important;
                                            font-size: 2em;
                                            background-color: #ffeedd;
                                            color: #DC191F;
                                            border-radius: 10px;
                                            opacity: 0.9;
                                            border: 2px solid #eeddcc;
                                            width: 320px
                                        }
                                        .brainpal-hide {
                                            opacity: 0
                                        }
                                        `
                }
              },
              {
                name   : InjectExecutor.name,
                options: {
                  html    : `<div class='brainpal'>
                                                <input class='brainpal' />
                                                <span class='typer'></span>
                                               </div>`,
                  position: 'beforeBegin',
                  target  : '.form337'
                }
              },
              {
                name   : SwalExecutor.name,
                options: {
                  on    : true,
                  swalFn: function (swal) {
                    swal({
                           type             : 'question',
                           title            : 'רק עוד דבר קטן..',
                           text             : 'לאיזה מספר לחזור אליך?',
                           input            : 'tel',
                           showConfirmButton: true,
                           confirmButtonText: 'שלח',
                           showCancelButton : false,
                           allowOutsideClick: false,
                           preConfirm       : function (tel) {
                             return new Promise(function (resolve, reject) {
                               if (/^0[0-9]{9}$/.test(tel)) {
                                 resolve(tel);
                               } else {
                                 reject('מספר לא חוקי')
                               }
                             })
                           },
                         }).catch(swal.noop)
                           .then(function (tel) {
                             if (!tel) {
                               tel = document.querySelector(
                                 'input.swal2-input').value;
                             }
                             _sendForm(tel);
                           });
                    new WordEvent({
                      waitTime: 500, enforceRegex: true, regex: /^0[0-9]{9}$/,
                      target  : 'input.swal2-input'
                    });
                    _.on(Factory.eventName(WordEvent.name()),
                         () => {swal.clickConfirm()}, {}, 'input.swal2-input');

                  }
                }
              },
              {
                name   : AlertifyExecutor.name,
                options: {
                  on        : true,
                  alertifyFn: function (alertify) {
                    alertify.set('notifier', 'position', 'bottom-left');
                    alertify.notify('לא שיפרת, לא שילמת!', 'message', 20);
                    setTimeout(() => {
                      alertify.notify('המבצע תקף עד ה-31.1', 'message', 20);
                      setTimeout(() => {
                        alertify.dismissAll();
                        _.trigger('alertify-dismissed');
                      }, 5000);
                    }, 3000);
                  },
                  rtl       : true
                }
              },
              {
                name   : TooltipInterface.name,
                options: {
                  type       : 'line',
                  target     : 'input.brainpal',
                  htmlContent: 'נשמח ליצור איתך קשר, רשום איך קוראים לך'
                }
              },
              {
                name   : TyperExecutor.name,
                options: {
                  typerFn: function (typer) {
                    let span       =
                          document.querySelector('div.brainpal span.typer');
                    span.style.top =
                      (span.clientHeight -
                       document.querySelector('input.brainpal').clientHeight)
                        .toString() + 'px';
                    let typerObj   = typer('div.brainpal span.typer', 40)
                      .cursor({blink: 'soft'});
                    for (let j = 0; j < 3; j++) {
                      typerObj.back('all')
                              .continue('איך קוראים לך?', 25)
                              .pause(1500);
                      for (let i = 0; i < names.length; i++) {
                        typerObj.back('all', 10)
                                .pause()
                                .continue(names[i % names.length] + '?')
                                .pause(1500);
                      }
                    }
                    typerObj.run(focusInput);
                    typerObj.end();
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen  : {
                    event : 'mouseover',
                    target: 'div.brainpal'
                  },
                  callback: focusInput
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  create: {
                    event  : WordEvent.name(),
                    options: {
                      target  : 'input.brainpal',
                      regex   : /[^\s]+/,
                      waitTime: 1500
                    }
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen : {
                    event : Factory.eventName(WordEvent.name()),
                    target: 'input.brainpal'
                  },
                  trigger: {
                    event: Executor.eventName(SwalExecutor.name)
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  create: {
                    event  : IdleEvent.name(),
                    options: {
                      detailOrId: 1,
                      waitTime  : 5000
                    }
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen : {
                    event     : Factory.eventName(IdleEvent.name()),
                    detailOrId: 1
                  },
                  trigger: {
                    event: Executor.eventName(AlertifyExecutor.name)
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen: {
                    event: 'alertify-dismissed',
                  },
                  create: {
                    event  : IdleEvent.name(),
                    options: {
                      waitTime  : 5000,
                      detailOrId: 2
                    }
                  }
                }
              },
              {
                name   : EventExecutor.name,
                options: {
                  listen : {
                    event     : Factory.eventName(IdleEvent.name()),
                    detailOrId: 2
                  },
                  trigger: {
                    event: Executor.eventName(TooltipInterface.name)
                  }
                }
              }
            ]
          }
        ]
      },
      options   : {
        subjectOptions: {
          anchor: {
            selector: '#send_lead',
            event   : 'click'
          }
        }
      }
    }
  ]
};

function _sendForm(tel) {
  document.querySelector('.inputs-wrapper input:nth-of-type(1)').value =
    document.querySelector('input.brainpal').value;
  document.querySelector('.inputs-wrapper input:nth-of-type(2)').value =
    tel || document.querySelector('swal2-input').value;
  _.trigger('click', {}, '#send_lead');
}

const names = ['נועם', 'תמר', 'אורי', 'נועה', 'איתי', 'יעל', 'דניאל'];

function focusInput() {
  document.querySelector('div.brainpal .white-space').classList.add('brainpal-hide');
  document.querySelector('input.brainpal').focus();
  setTimeout(() => {
    document.querySelector('div.brainpal span.typer').style.display = 'none';
  }, 500);
}

Play(configuration);
