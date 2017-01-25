/**
 * Proudly created by ohad on 25/01/2017.
 */
const express = require('express'),
      fs      = require('fs'),
      path    = require('path'),
      Auth    = require('./auth');
let app       = express();

process.env.PORT = process.env.PORT || 5000;
app.set('port', process.env.PORT);

const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

app.get('/serve/:customer/brain.js', function (request, response) {
  const customer = request.params.customer,
        apiKey   = request.query.apiKey;
  if (!Auth.auth(customer, apiKey)) {
    response.status(403);
    response.type('txt').send('');
  }
  const brainJsPath = path.join(distPath, `${customer}.js`);
  if (!fs.existsSync(brainJsPath)) {
    response.status(500);
    response.type('txt').send('');
  }
  response.sendFile(brainJsPath);
});

app.get('*', function (request, response) {
  response.status(404);
  response.type('txt').send('');
});

app.listen(app.get('port'), function () {
  console.log('BrainPal is running on port', app.get('port'));
});

module.exports = app;
