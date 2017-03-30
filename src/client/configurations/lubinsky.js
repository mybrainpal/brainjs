/**
 * Proudly created by ohad on 10/03/2017.
 */
const $                 = require('../common/util/dom'),
      Play              = require('../play'),
      Factory           = require('../common/events/factory'),
      IdleEvent         = require('../common/events/idle'),
      WordEvent         = require('../common/events/word'),
      Master            = require('../manipulation/execute/master'),
      EventExecutor     = require('../manipulation/execute/interaction/event'),
      AlertifyInterface = require('../manipulation/execute/interface/alertify'),
      SwalInterface     = require('../manipulation/execute/interface/sweetalert'),
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
      },
      {
        experiment: {
          id          : 2,
          label       : 'modal',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, minWidth: 800}],
          groups      : [
            {
              label    : 'modal',
              executors: [
                {
                  name   : StyleExecutor.name,
                  options: {css: `[class^='swal2'] { direction: rtl}`}
                },
                {
                  name   : SwalInterface.name,
                  options: {
                    on    : true,
                    swalFn: (swal) => {
                      swal.setDefaults(
                        {
                          allowEscapeKey   : false,
                          showConfirmButton: true,
                          showCancelButton : false,
                          allowOutsideClick: false,
                          allowEnterKey    : true
                        });
                      //noinspection JSUnusedGlobalSymbols
                      swal.queue([{
                        type             : 'success',
                        title            : 'לקבלת עד 40% הנחה',
                        text             : 'לאיזה מספר לחזור אליך?',
                        input            : 'tel',
                        confirmButtonText: 'דברו איתי &larr;',
                        preConfirm       : function (tel) {
                          return new Promise(function (resolve, reject) {
                            if (/^0[0-9]{9}$/.test(tel)) {
                              resolve(tel);
                            } else {
                              reject('מספר לא חוקי')
                            }
                          })
                        }
                      }, {
                        type             : 'question',
                        title            : 'רק עוד קצת..',
                        text             : 'איך קוראים לך?',
                        input            : 'text',
                        confirmButtonText: 'קליק וסיימנו &larr;',
                        preConfirm       : function (name) {
                          return new Promise(function (resolve, reject) {
                            if (/.+/.test(name)) {
                              resolve(name);
                            } else {
                              reject('חשוב לנו לדעת מה שמך')
                            }
                          })
                        }
                      }, {
                        type             : 'question',
                        title            : 'איפה נוח לך?',
                        text             : 'בחר/י את הסניף הקרוב לנסיעת מבחן',
                        input            : 'select',
                        inputOptions     : {
                          '0': 'חיפה',
                          '1': 'תל אביב',
                          '2': 'ירושלים'
                        },
                        confirmButtonText: 'שלח/י',
                        onOpen           : () => {
                          setTimeout(
                            () => {document.querySelector('.swal2-modal.swal2-show').focus()});
                        }
                      }]).catch(swal.noop)
                          .then(function (response) {
                            const formData = {
                              name: response[1],
                              tel : response[0],
                              city: response[2]
                            };
                            _sendForm(formData);
                          });
                      new WordEvent({
                                      waitTime: 500, enforceRegex: true, regex: /^0[0-9]{9}$/,
                                      target                                  : 'input.swal2-input'
                                    });
                      $.on(Factory.eventName(WordEvent.name()),
                           () => {
                             swal.clickConfirm();
                             new WordEvent({waitTime: 1000, target: 'input.swal2-input'});
                             $.on(Factory.eventName(WordEvent.name()),
                                  () => {
                                    swal.clickConfirm();
                                  }, {}, 'input.swal2-input');
                           }, {}, 'input.swal2-input');
                    }
                  }
                },
                {
                  name   : EventExecutor.name,
                  options: {
                    create: {
                      event  : IdleEvent.name(),
                      options: {
                        detailOrId: 'swal',
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
                      detailOrId: 'swal'
                    },
                    trigger: {
                      event: Master.eventName(SwalInterface.name)
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

function _sendForm(formData) {
  document.querySelector('#Input_textbox_0').value  = formData.name;
  document.querySelector('#Input_textbox_1').value  = formData.tel;
  document.querySelector('#Input_ndropbox_0').value = formData.city;
  $.trigger('click', {}, '#Button_submitButton_0');
}