/**
 * Proudly created by ohad on 20/12/2016.
 */
let _                   = require('./../common/util/wrapper'),
    expect              = require('chai').expect,
    chai                = require('chai'),
    ManipulatorInjector = require('inject-loader!./manipulator'),
    Demographics        = require('./experiment/demographics'),
    Experiment          = require('./experiment/experiment'),
    _storage            = [];

chai.use(require('chai-spies'));

describe('Manipulator', function () {
  let Manipulator, experiment, clientGroup, nonClientGroup,
      anchor, dataProp,
      div, a, span,
      collectorSpy, collectorMock, executorSpy, executorMock;
  before(() => {
    div = document.createElement('div');
    div.setAttribute('id', 'manipulator');
    document.querySelector('body').appendChild(div);
    span             = document.createElement('span');
    span.textContent = 'Screw it,';
    div.appendChild(span);
    a             = document.createElement('a');
    a.textContent = 'Let\'s do it!';
    div.appendChild(a);
    collectorMock  = {collect: _collectMockFn};
    collectorSpy   = chai.spy.on(collectorMock, 'collect');
    executorMock   = {execute: _executeMockFn};
    executorSpy    = chai.spy.on(executorMock, 'execute');
    Manipulator    = ManipulatorInjector(
      {'../collection/collector': collectorMock, './execute/master': executorMock});
    anchor         = {selector: '#manipulator>a', event: 'click'};
    dataProp       = {name: 'reaction', selector: '#manipulator>span'};
    clientGroup    = {
      label       : 'client',
      executors   : [
        {
          name    : 'style',
          selector: '#manipulator>span',
          options : {options: {style: 'span {margin-top: 10px}'}}
        }
      ],
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [0], moduloOf: 1
      }]
    };
    nonClientGroup = {
      label       : 'non-client',
      executors   : [
        {
          name    : 'style',
          selector: '#manipulator>span',
          options : {options: {style: 'span {margin-bottom: 10px}'}}
        }
      ],
      demographics: [{
        name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1
      }]
    };
    experiment     = {
      id    : 1,
      label : 'the virgin way',
      groups: [clientGroup, nonClientGroup]
    };
  });
  afterEach(() => {
    _storage = [];
    collectorSpy.reset();
    executorSpy.reset();
    // Clean all injected styles.
    document.querySelectorAll('style[' + _.css.identifyingAttribute + ']')
            .forEach(function (styleElement) {
              styleElement.parentNode.removeChild(styleElement);
            });
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('experiment runs', () => {
    Manipulator.experiment(new Experiment(experiment),
                           {subjectOptions: {dataProps: [dataProp], anchor: anchor}});
    expect(collectorSpy).to.have.been.called(4);
    // log participation in experiment or lack there of.
    expect(_storage[0][0]).to.contain.all.keys('experiment');
    // experiment participation collection should not have anchor.
    expect(_storage[0][0]).to.not.contain.any.keys('anchor');
    // collect data on experiment group based on anchors
    expect(_storage[1][0]).to.contain.all.keys('experiment', 'anchor', 'experimentGroup');
    // log participation in experiment group or lack there of.
    expect(_storage[2][0]).to.contain.all.keys('experiment', 'experimentGroup');
    // experiment group participation collection should not have anchor.
    expect(_storage[2][0]).to.not.contain.any.keys('anchor');
    // collect data based on anchors.
    expect(_storage[3][0]).to.contain.all.keys('experiment', 'anchor');
    // Executor should be called for each executor in clientGroup.
    expect(executorSpy).to.have.been.called(clientGroup.executors.length);
  });
  it('array of subject options', () => {
    Manipulator.experiment(new Experiment(experiment),
                           {
                             subjectOptions: [{dataProps: [dataProp], anchor: anchor},
                                              {dataProps: [dataProp], anchor: anchor}]
                           });
    // Executor should be called for twice for each executor in clientGroup.
    expect(executorSpy).to.have.been.called(2 * clientGroup.executors.length);
  });
  it('experiment without client groups', () => {
    let noClientGroups    = _.deepExtend({}, experiment);
    noClientGroups.groups = [nonClientGroup];
    Manipulator.experiment(new Experiment(noClientGroups));
    expect(collectorSpy).to.have.been.called.once;
    expect(executorSpy).to.not.have.been.called();
  });
});

function _collectMockFn() {
  _storage.push(arguments);
}

function _executeMockFn() {}
