/**
 * Proudly created by ohad on 14/02/2017.
 */
const _          = require('lodash'),
      router     = require('express').Router(),
      bodyParser = require('body-parser'),
      Datastore  = require('@google-cloud/datastore');

const datastore = Datastore();

router.use('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.post('/', bodyParser.json(), function (req, res) {
  if (!_.isObjectLike(req.body) || !req.body.kind || !_.isString(req.body.kind)) {
    console.error('Save req.body is illegal.');
    res.status(500);
    res.type('txt').send('');
    return;
  }
  const key    = datastore.key(req.body.kind);
  const toSave = {key: key, data: req.body};
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