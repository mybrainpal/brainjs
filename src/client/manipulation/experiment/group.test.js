/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect          = require('chai').expect,
    chai            = require('chai'),
    ExperimentGroup = require('./group');

describe('ExperimentGroup', function () {
  let group;
  before(() => {
    require('./../../common/client').id = 1; // So that demographics apply.
  });
  it('client included', () => {
    group = new ExperimentGroup({
      demographics: {
        properties: [{
          name: 'modulo', moduloIds: [0], moduloOf: 1
        }]
      }
    });
    expect(group.isClientIncluded).to.be.true;
  });
  it('client not included', () => {
    group = new ExperimentGroup({
      demographics: {
        properties: [{
          name: 'modulo', moduloIds: [], moduloOf: 1
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
