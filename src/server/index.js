/**
 * Proudly created by ohad on 25/01/2017.
 */
const express = require('express');
let app       = express();

process.env.PORT = process.env.PORT || 5000;
app.set('port', process.env.PORT);

app.get('/', function (request, response) {
  response.send(`console.log('See you at BrainPal.io ;)')`);
});

app.listen(app.get('port'), function () {
  console.log('BrainPal is running on port', app.get('port'));
});
