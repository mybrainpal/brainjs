/**
 * Proudly created by ohad on 25/01/2017.
 */
const chai = require('chai'),
      Main = require('./app');

chai.use(require('chai-http'));

describe('Main', function () {
  this.timeout(1000);
});