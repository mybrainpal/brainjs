/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect          = require('chai').expect,
    chai            = require('chai'),
    Demographics    = require('./demographics'),
    ExperimentGroup = require('./group');

describe('ExperimentGroup', function () {
  let group;
  it('client included', () => {
    group = new ExperimentGroup({
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 1
        }]
    });
    expect(group.isClientIncluded).to.be.true;
  });
  it('client not included', () => {
    group = new ExperimentGroup({
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1
        }]
    });
    expect(group.isClientIncluded).to.be.false;
  });
  it('default constructor', () => {
    group = new ExperimentGroup();
    expect(group.isClientIncluded).to.be.true;
  });
});
