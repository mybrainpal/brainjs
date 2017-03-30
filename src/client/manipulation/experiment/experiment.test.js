/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect       = require('chai').expect,
    chai         = require('chai'),
    BaseError    = require('../../common/log/base.error'),
    Experiment   = require('./experiment'),
    Demographics = require('./demographics');

describe('Experiment', function () {
  let clientGroup, nonClientGroup, experiment, options;
  before(() => {
    clientGroup    = {
      id          : 1,
      demographics: [{name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 1}]
    };
    nonClientGroup = {
      id: 2, demographics: [{name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1}]
    };
    options        = {id: 1, groups: [clientGroup, nonClientGroup]};
  });
  it('constructor', () => {
    experiment = new Experiment(options);
    expect(experiment).to.be.instanceOf(Experiment);
    expect(experiment.groups).to.have.length(2);
    for (let i = 0; i < experiment.groups.length; i++) {
      expect(experiment.groups[i].experimentId).to.equal(1);
    }
    expect(experiment.included).to.be.true;

    expect(() => {new Experiment({})}).to.throw(Error);
    expect(() => {new Experiment()}).to.throw(Error);
    expect(() => {new Experiment({groups: [clientGroup]})}).to.throw(BaseError);
    expect(() => {new Experiment({id: 1})}).to.throw(BaseError);
    expect(() => {new Experiment({id: 1, groups: []})}).to.throw(Error);
    expect(() => {new Experiment({id: 1, groups: 1})}).to.throw(Error);
  });
  it('client included', () => {
    experiment = new Experiment(options);
    expect(experiment.groups).to.have.length(2);
    expect(experiment.clientGroups).to.have.length(1);
  });
  it('client not included', () => {
    experiment = new Experiment({id: 1, groups: [nonClientGroup]});
    expect(experiment.clientGroups).to.be.empty;
    expect(experiment.clientGroups).to.be.instanceOf(Array);
    expect(experiment.groups).to.have.length(1);
  });
});