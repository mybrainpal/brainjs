/**
 * Proudly created by ohad on 12/12/2016.
 */
var assert = require('chai').assert;
var Demographics = require('./demographics');

describe('Demographics', function () {
    it('no options includes the entire population', function () {
        var demographics = new Demographics();
        assert.equal(demographics.included, true);
    });
});