/**
 * Proudly created by ohad on 14/02/2017.
 */
const router     = require('express').Router(),
      bodyParser = require('express').bodyParser();

router.param('message', function (req, res, next, name) {
  console.log('validating ' + name);
  console.log('value: ' + req.params(name));
  next();
});

router.use('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(bodyParser);

router.post('/', function (req, res) {
  console.log('processing: ' + req.body.message);
  res.status(200);
  res.send('');
});

module.exports = router;