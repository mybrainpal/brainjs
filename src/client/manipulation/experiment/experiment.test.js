/**
 * Proudly created by ohad on 21/12/2016.
 */
let expect     = require('chai').expect,
    chai       = require('chai'),
    Experiment = require('./experiment');

describe('Experiment', function () {
  let clientGroup, nonClientGroup, experiment;
  before(() => {
    require('./../../common/client').id = 1; // So that demographics apply.
    clientGroup                         =
      {demographics: {properties: [{name: 'modulo', moduloIds: [0], moduloOf: 1}]}};
    nonClientGroup                      =
      {demographics: {properties: [{name: 'modulo', moduloIds: [], moduloOf: 1}]}};
  });
  it('experiment ID propagated to groups constructor', () => {
    experiment = new Experiment({id: 1, groups: [clientGroup, nonClientGroup]});
    expect(experiment.groups).to.have.length(2);
    for (let i = 0; i < experiment.groups.length; i++) {
      expect(experiment.groups[i].experimentId).to.be.ok;
    }
  });
  it('client included', () => {
    experiment = new Experiment({groups: [clientGroup, nonClientGroup]});
    expect(experiment.isClientIncluded).to.be.true;
    expect(experiment.clientGroups).to.have.length(1);
    expect(experiment.groups).to.have.length(2);
  });
  it('client not included', () => {
    experiment = new Experiment({groups: [nonClientGroup]});
    expect(experiment.isClientIncluded).to.be.false;
    expect(experiment.clientGroups).to.be.empty;
    expect(experiment.groups).to.have.length(1);
  });
  it('no groups', () => {
    experiment = new Experiment();
    expect(experiment.isClientIncluded).to.be.false;
    expect(experiment.clientGroups).to.be.empty;
    expect(experiment.groups).to.be.empty;
  });
});