/**
 * Proudly created by ohad on 12/03/2017.
 */
const _             = require('../common/util/wrapper'),
      Play          = require('../play'),
      Factory       = require('../common/events/factory'),
      EventExecutor = require('../manipulation/execute/interaction/event'),
      IdleEvent     = require('../common/events/idle'),
      WordEvent     = require('../common/events/word'),
      Master        = require('../manipulation/execute/master'),
      StyleExecutor = require('../manipulation/execute/dom/style'),
      SwalInterface = require('../manipulation/execute/interface/sweetalert'),
      Demographics  = require('../manipulation/experiment/demographics'),
      Storage       = require('../common/storage/storage');

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
          label       : 'modal',
          demographics: [{name: Demographics.PROPERTIES.RESOLUTION.name, maxWidth: 1100}],
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
                        title            : 'לרכב חדש החל מ-349₪',
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
                        title            : 'איך קוראים לך?',
                        text             : 'נציג שלנו יחזור אליך בהקדם',
                        input            : 'text',
                        confirmButtonText: 'שלח/י',
                        preConfirm       : function (name) {
                          return new Promise(function (resolve, reject) {
                            if (/.+/.test(name)) {
                              resolve(name);
                            } else {
                              reject('חשוב לנו לדעת מה שמך')
                            }
                          })
                        }
                      }]).catch(swal.noop)
                          .then(function (response) {
                            const formData = {
                              name: response[1],
                              tel : response[0]
                            };
                            _sendForm(formData);
                          });
                      new WordEvent({
                        waitTime: 500, enforceRegex: true, regex: /^0[0-9]{8,9}$/,
                        target                                  : 'input.swal2-input'
                      });
                      _.on(Factory.eventName(WordEvent.name()),
                           () => {
                             swal.clickConfirm();
                             new WordEvent({waitTime: 1000, target: 'input.swal2-input'});
                             _.on(Factory.eventName(WordEvent.name()),
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
  document.querySelector('#Input_ndropbox_0').value = formData.tel.length === 9 ?
                                                      formData.tel.substr(0, 2) :
                                                      formData.tel.substr(0, 3);
  document.querySelector('#Input_textbox_2').value  = formData.tel.length === 9 ?
                                                      formData.tel.substr(2) :
                                                      formData.tel.substr(3);
  _.trigger('click', {}, '#Button_submitButton_0');
}