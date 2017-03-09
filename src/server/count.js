/**
 * Proudly created by ohad on 06/03/2017.
 */
const _         = require('lodash'),
      router    = require('express').Router(),
      Datastore = require('@google-cloud/datastore'),
      Const     = require('../common/const');

const datastore = Datastore();

router.use('/', function (req, res, next) {
  if (process.env.NODE_ENV === Const.ENV.DEV) {
    res.header('Access-Control-Allow-Origin', 'http://localhost');
  } else {
    res.header('Access-Control-Allow-Origin', 'https://dashboard.brainpal.io');
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/uplift', function (req, res) {
  const tracker       = req.query.tracker,
        fromTimestamp = _.parseInt(req.query.fromTimestamp),
        toTimestamp   = _.parseInt(req.query.toTimestamp);
  if (!_.isString(tracker)) {
    console.error(`Count: tracker ain't a string darling tracker = ${tracker}`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  if (!_.isInteger(fromTimestamp)) {
    console.error(`Count: fromTimestamp is no integer darling, ${err.toString()}`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  if (fromTimestamp < 0) {
    console.error(`Count: fromTimestamp (=${fromTimestamp}) is negative.`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  if (!_.isInteger(toTimestamp)) {
    console.error(`Count: toTimestamp is no integer darling, ${err.toString()}`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  if (toTimestamp < 0) {
    console.error(`Count: toTimestamp (=${toTimestamp}) is negative.`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  if (toTimestamp < fromTimestamp) {
    console.error(`Count: toTimestamp(${toTimestamp}) < fromTimestamp(${fromTimestamp})`);
    res.status(500);
    res.type('txt').send('');
    return;
  }
  const query = datastore.createQuery(Const.KIND.EVENT)
                         .filter('timestamp', '>', fromTimestamp)
                         .filter('timestamp', '<', toTimestamp)
                         .filter('experiment.included', '=', true)
                         .filter('tracker', '=', tracker);
  datastore.runQuery(query).then((results) => {
    let total              = 0,
        conversionOfAll    = 0,
        groups             = 0,
        conversionOfGroups = 0;
    results[0].forEach((entity) => {
      if (entity['anchor.event']) {
        conversionOfAll += 1;
        if (entity['experimentGroup.included']) conversionOfGroups += 1;
      } else {
        total += 1;
        if (entity['experimentGroup.included']) groups += 1;
      }
    });
    res.status(200);
    res.type('application/json');
    res.send({
               total             : total,
               conversionOfAll   : conversionOfAll,
               groups            : groups,
               conversionOfGroups: conversionOfGroups
             });
  }).catch((err) => {
    console.error(`Count uplift query for ${tracker}: ${err.code} ${err.status} - ${err.message}`);
    res.status(500);
    res.type('txt').send('');
  })
  ;
});

module.exports = router;