/**
 * Proudly created by ohad on 14/02/2017.
 */
const Play    = require('../play'),
      Storage = require('../common/storage/storage');

const configuration = {
  storage: {
    name   : Storage.names.GOOGLE_ANALYTICS,
    options: {
      trackingId: 'UA-91064115-5'
    }
  }
};

Play(configuration);