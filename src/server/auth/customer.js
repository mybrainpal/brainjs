/**
 * Proudly created by ohad on 25/01/2017.
 */
const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const customerSchema = new Schema({
  /**
   * Customer's name, i.e. Facebook
   */
  name  : String,
  /**
   * API key to be used when requesting brainjs.
   */
  apiKey: String,
  /**
   * URL that should have BrainPal running.
   */
  url   : String
});

module.exports = mongoose.model('Customer', customerSchema);