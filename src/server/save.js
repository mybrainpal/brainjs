/**
 * Proudly created by ohad on 14/02/2017.
 */
const router = require('express').Router();

router.param('message', function (req, res, next, name) {
  console.log('validating ' + name);
  console.log('value: ' + req.param(name));
});

router.post('/:message', function (req, res) {
  console.log('processing: ' + req.param.message);
  res.status(200);
  res.send('');
});