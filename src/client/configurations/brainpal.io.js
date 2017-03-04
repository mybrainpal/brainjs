/**
 * Proudly created by ohad on 28/01/2017.
 */
const Play    = require('../play'),
      Storage = require('../common/storage/storage');

const configuration = {
  storage: {
    name: Storage.names.POST,
  }
};

Play(configuration);