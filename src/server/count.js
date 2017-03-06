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

router.get('/uplift/:tracker/:fromTimestamp/:toTimestamp', function (req, res) {
  const tracker = req.query('tracker'),
        fromTimestamp = req.query('fromTimestamp'),
        toTimestamp   = req.query('toTimestamp');
  if (!_.isString(tracker)) {
    console.error(`Count: illegal value tracker=${tracker}`);
    res.status(500);
    res.type('txt').send('');
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
                         .filter('experiment.included', '=', true)
                         .filter('tracker', '=', tracker)
                         .groupBy('client.created');
  datastore.runQuery(query).then((results) => {
    let total              = 0,
        conversionOfAll    = 0,
        groups             = 0,
        conversionOfGroups = 0;
    results[0].forEach((entity) => {
      if (!entity.anchor.event) {
        total += 1;
        if (entity.experimentGroup.included) groups += 1;
      } else {
        conversionOfAll += 1;
        if (entity.experimentGroup.included) conversionOfGroups += 1;
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