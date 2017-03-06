/**
 * Proudly created by ohad on 02/12/2016.
 */
const Play    = require('../play'),
      Storage = require('../common/storage/storage');

// Let the games begin.
Play({
       storage: {
         name: Storage.names.POST
       },
       tracker: 'thatTheWayItIs'
     });
