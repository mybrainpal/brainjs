/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect          = require('chai').expect,
    chai            = require('chai'),
    Client          = require('./../../common/client'),
    Demographics    = require('./demographics'),
    ExperimentGroup = require('./group');

describe('ExperimentGroup', function () {
  let group;
  it('client included', () => {
    group = new ExperimentGroup({
      demographics: {
        properties: [{
          name: Demographics.PROPERTIES.MODULO, moduloIds: [Client.id], moduloOf: 1
        }]
      }
    });
    expect(group.isClientIncluded).to.be.true;
  });
  it('client not included', () => {
    group = new ExperimentGroup({
      demographics: {
        properties: [{
          name: Demographics.PROPERTIES.MODULO, moduloIds: [], moduloOf: 1
        }]
      }
    });
    expect(group.isClientIncluded).to.be.false;
  });
  it('default constructor', () => {
    group = new ExperimentGroup();
    expect(group.isClientIncluded).to.be.true;
  });
});
