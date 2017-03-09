/**
 * Proudly created by ohad on 14/02/2017.
 */
const _          = require('lodash'),
      flatten    = require('flat'),
      router     = require('express').Router(),
      bodyParser = require('body-parser'),
      Datastore  = require('@google-cloud/datastore'),
      Const      = require('../common/const');

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

router.post('/', bodyParser.json(), function (req, res) {
  if (!_.isObjectLike(req.body) || !_.isString(req.body.kind)) {
    console.error('Save: illegal value for req.body=' + JSON.stringify(req.body));
    res.status(500);
    res.type('txt').send('');
    return;
  }
  const key    = datastore.key(req.body.kind);
  const toSave = {key: key, data: flatten(req.body, {safe: true})};
  datastore.upsert(toSave)
           .then(() => {
             res.status(200);
             res.type('txt').send('');
           })
           .catch((err) => {
             console.error(`Save ${err.code} ${err.status}: ${err.message}`);
             res.status(500);
             res.type('txt').send('');
           });
});

module.exports = router;