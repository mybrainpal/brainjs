/**
 * Proudly created by ohad on 28/01/2017.
 */
const AlertifyInterface = require('../../manipulation/execute/interface/alertify'),
      Play              = require('../../play');

const configuration = {
  storage    : {
    name   : 'google-analytics',
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
            demographics: {name: 'modulo', moduloIds: [0, 1], moduloOf: 2},
            executors   : [
              {
                name   : AlertifyInterface.name,
                options: {
                  alertifyFn: (alertify) => {
                    alertify.set('notifier', 'position', 'bottom-left');
                    alertify.notify('Does your privacy matters to you?', 'message', 10);
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
            selector: 'a.button',
            event   : 'click'
          }
        }
      }
    }
  ],

};

Play(configuration);
