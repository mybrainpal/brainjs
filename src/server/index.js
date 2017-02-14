/**
 * Proudly created by ohad on 25/01/2017.
 */
const express    = require('express'),
      rollbar    = require('rollbar'),
      fs         = require('fs'),
      path       = require('path'),
      saveRouter = require('./save'),
      Const      = require('../common/const');
let app          = express();

process.env.PORT = process.env.PORT || 5000;
app.set('port', process.env.PORT);

console.log('Initializing Rollbar.');
app.use(rollbar.errorHandler('8df4cb488f724dfd9fe78b636b5db9a3'));

app.post('/save', saveRouter);

app.get('*', function (request, response) {
  response.status(404);
  response.type('txt').send('');
});

app.listen(app.get('port'), function () {
  console.log('BrainPal is running on port', app.get('port'));
});

module.exports = app;
