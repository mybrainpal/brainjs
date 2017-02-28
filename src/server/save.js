/**
 * Proudly created by ohad on 14/02/2017.
 */
const router     = require('express').Router(),
      bodyParser = require('body-parser');

router.use('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.post('/', bodyParser.json(), function (req, res) {
  if (!req.body) {
    res.status(500);
    res.send('');
  }
  res.status(200);
  res.send('');
});

module.exports = router;