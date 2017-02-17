/**
 * Proudly created by ohad on 28/01/2017.
 */
const Play = require('../play');

const configuration = {
  storage: {
    name   : 'google-analytics',
    options: {
      trackingId: 'UA-91064115-1'
    }
  }
};

Play(configuration);