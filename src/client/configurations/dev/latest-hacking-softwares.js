/**
 * Proudly created by ohad on 08/02/2017.
 */
const Play = require('../../play');

const configuration = {
  storage: {
    name   : Storage.names.GOOGLE_ANALYTICS,
    options: {
      trackingId: 'UA-91064115-3'
    }
  }
};

Play(configuration);