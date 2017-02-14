/**
 * Proudly created by ohad on 02/12/2016.
 */
const Play = require('../play');

// Let the games begin.
Play({
       storage: {
         name: require('../common/storage/storage').names.POST
       }
     });
