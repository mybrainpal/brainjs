/**
 * Proudly created by ohad on 06/03/2017.
 */
const _         = require('lodash'),
      router    = require('express').Router(),
      Datastore = require('@google-cloud/datastore'),
      Const     = require('../common/const');

const datastore = Datastore();

router.use('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://dashboard.brainpal.io');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/total-uplift/:encodedUrl/:fromTimestamp/:toTimestamp', function (req, res) {
  const url           = decodeURIComponent(req.query('encodedUrl')),
        fromTimestamp = req.query('fromTimestamp'),
        toTimestamp   = req.query('toTimestamp');
  if (!_.isString(url)) {
    console.error(`Count: illegal value url=${url}`);
    return;
  }
  if (!_.isInteger(fromTimestamp) || fromTimestamp <= 0) {
    console.error(`Count: illegal value fromTimestamp=${fromTimestamp}`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  if (!_.isInteger(toTimestamp) || toTimestamp <= 0) {
    console.error(`Count: illegal value toTimestamp=${toTimestamp}`);
    res.status(500);
    res.type('txt').send('');
    return;
  } else if (toTimestamp < fromTimestamp) {
    console.error(`Count: toTimestamp(${toTimestamp}) < fromTimestamp(${fromTimestamp})`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  const query = datastore.createQuery(null, Const.KIND.EVENT)
                         .filter('timestamp', '>', fromTimestamp)
                         .filter('timestamp', '<', toTimestamp)

});

module.exports = router;