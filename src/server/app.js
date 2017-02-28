/**
 * Proudly created by ohad on 25/01/2017.
 */
const express    = require('express'),
      saveRouter = require('./save'),
      Const      = require('../common/const');

// [START APP]
let app          = express();
process.env.PORT = process.env.PORT || Const.LOCAL_PORT;
app.set('port', process.env.PORT);

app.use('/save', saveRouter);

app.get('*', function (req, res) {
  res.status(404);
  res.type('txt').send('');
});

app.listen(app.get('port'), function () {
  console.log('BrainPal is running on port', app.get('port'));
});

module.exports = app;
// [END APP]
