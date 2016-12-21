/**
 * Proudly created by ohad on 20/12/2016.
 */
var _           = require('./../common/util/wrapper'),
    expect      = require('chai').expect,
    chai        = require('chai'),
    rewire      = require('rewire'),
    Manipulator = rewire('./manipulator'),
    Experiment  = require('./experiment/experiment'),
    _storage    = [];

chai.use(require('chai-spies'));

describe('Manipulator', function () {
    var experiment, clientGroup, nonClientGroup,
        anchor, subjectProp,
        div, a, span,
        collectorSpy, collectorMock, executorSpy, executorMock;
    before(function () {
        div = document.createElement('div');
        div.setAttribute('id', 'manipulator');
        document.querySelector('body').appendChild(div);
        span             = document.createElement('span');
        span.textContent = 'Screw it,';
        div.appendChild(span);
        a             = document.createElement('a');
        a.textContent = 'Let\'s do it!';
        div.appendChild(a);
        collectorMock = {collect: _collectMockFn};
        collectorSpy  = chai.spy.on(collectorMock, 'collect');
        executorMock  = {execute: _executeMockFn};
        executorSpy   = chai.spy.on(executorMock, 'execute');
        Manipulator.__set__({Collector: collectorMock, Executor: executorMock});
        require('./../common/client').id = 1; // So that demographics apply.
        anchor                           = {selector: '#manipulator>a', event: 'click'};
        subjectProp                      = {name: 'reaction', selector: '#manipulator>span'};
        clientGroup                      = {
            label       : 'client',
            executors   : [
                {
                    name    : 'style',
                    selector: '#manipulator>span',
                    options : {specs: {style: 'span {margin-top: 10px}'}}
                }
            ],
            demographics: {properties: [{name: 'modulo', moduloIds: [0], moduloOf: 1}]}
        };
        nonClientGroup                   = {
            label       : 'non-client',
            executors   : [
                {
                    name    : 'style',
                    selector: '#manipulator>span',
                    options : {specs: {style: 'span {margin-bottom: 10px}'}}
                }
            ],
            demographics: {properties: [{name: 'modulo', moduloIds: [], moduloOf: 1}]}
        };
        experiment                       = {
            id    : 1,
            label : 'the virgin way',
            groups: [clientGroup, nonClientGroup]
        };
    });
    afterEach(function () {
        _storage = [];
        collectorSpy.reset();
        executorSpy.reset();
        // Clean all injected styles.
        document.querySelectorAll('style[' + _.css.identifyingAttribute + ']')
                .forEach(function (styleElement) {
                    styleElement.parentNode.removeChild(styleElement);
                });
    });
    after(function () {
        div.parentNode.removeChild(div);
    });
    it('experiment runs', function () {
        Manipulator.experiment(new Experiment(experiment),
                               {subjectProps: [subjectProp], anchors: [anchor]});
        expect(collectorSpy).to.have.been.called(3);
        // collect data based on anchors.
        expect(_storage[0][0]).to.have.keys('experiment', 'anchor');
        // log participation in experiment or lack there of.
        expect(_storage[1][0]).to.have.keys('experiment');
        // experiment participation collection should not have anchor.
        expect(_storage[1][0]).to.not.have.keys('anchor');
        // log group participation or lack there of.
        expect(_storage[2][0]).to.have.keys('experiment', 'experimentGroup');
        // group participation collection should not have anchor.
        expect(_storage[2][0]).to.not.have.keys('anchor');
        // executes for each clientGroup executor.
        expect(executorSpy).to.have.been.called(clientGroup.executors.length);
    });
    it('experiment with zero groups', function () {
        var noGroupsExperiment    = _.clone(experiment);
        noGroupsExperiment.groups = [];
        Manipulator.experiment(new Experiment(noGroupsExperiment));
        expect(collectorSpy).to.have.been.called.once;
        expect(executorSpy).to.not.have.been.called();
    });
    it('experiment without client groups', function () {
        var noClientGroups    = _.clone(experiment);
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