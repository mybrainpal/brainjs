/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect       = require('chai').expect,
    chai         = require('chai'),
    BaseError    = require('../../common/log/base.error'),
    Demographics = require('./demographics'),
    Group        = require('./group');

describe('Group', function () {
  let clientDemographics, nonClientDemographics, group;
  before(() => {
    clientDemographics    = [{
      name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 1
    }];
    nonClientDemographics = [{
      name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1
    }];
  });
  it('constructor', () => {
    group = new Group({id: 1, experimentId: 1});
    expect(group).to.be.instanceOf(Group);
    expect(group.included).to.be.true;
    expect(group.id).to.eq(1);
    expect(group.experimentId).to.eq(1);
    group = new Group({id: 1, experimentId: 1, label: 'a', executors: [1]});
    expect(group.label).to.equal('a');
    expect(group.executors).to.deep.equal([1]);
    group = new Group({id: 1, experimentId: 1, executors: {name: 'a'}});
    expect(group.executors).to.deep.equal([{name: 'a'}]);

    expect(() => {new Group()}).to.throw(BaseError);
    expect(() => {new Group({})}).to.throw(BaseError);
    expect(() => {new Group({experimentId: 1})}).to.throw(BaseError);
    expect(() => {new Group({id: 1})}).to.throw(BaseError);
    expect(() => {new Group({id: 1, experimentId: 1, label: 1})}).to.throw(BaseError);
  });
  it('client included', () => {
    group = new Group({id: 1, experimentId: 1, demographics: clientDemographics});
    expect(group.included).to.be.true;
  });
  it('client not included', () => {
    group = new Group({id: 1, experimentId: 1, demographics: nonClientDemographics});
    expect(group.included).to.be.false;
  });
});
