/**
 * Proudly created by ohad on 25/01/2017.
 */
const express  = require('express'),
      fs       = require('fs'),
      path     = require('path'),
      mongoose = require('mongoose'),
      Customer = require('./auth/customer'),
      Auth     = require('./auth/auth');
let app        = express();

process.env.PORT = process.env.PORT || 5000;
app.set('port', process.env.PORT);
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const distPath = path.resolve(__dirname, '../../dist');
app.use(express.static(distPath));

app.get('/serve/?:name/?:apiKey/brain.js', (request, response) => {
  //noinspection JSUnresolvedVariable
  const requestCustomer = new Customer({
    apiKey: request.params.apiKey,
    name  : request.params.name,
    url   : (request.headers ? request.headers.referer || '' : '').toLowerCase()
  });
  Auth.auth(requestCustomer).then((actualCustomer) => {
    const brainJsPath =
            path.join(distPath, `${Auth.isDev(request) ? 'dev/' : ''}${actualCustomer.name}.js`);
    fs.exists(brainJsPath, (exists) => {
      if (exists) {
        response.sendFile(brainJsPath);
      } else {
        response.status(500);
        response.type('txt').send('');
      }
    })
  }).catch((error) => {
    if (error) {
      console.error(`Failed to authenticate ${requestCustomer.name} (${requestCustomer.apiKey}) ` +
                    `because ${error.toString()}`);
    } else {
      response.status(403);
      response.type('txt').send('');
    }
  });
});

app.get('*', function (request, response) {
  response.status(404);
  response.type('txt').send('');
});

app.listen(app.get('port'), function () {
  console.log('BrainPal is running on port', app.get('port'));
});

module.exports = app;
