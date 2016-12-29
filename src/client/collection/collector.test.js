/**
 * Proudly created by ohad on 18/12/2016.
 */
let chai      = require('chai'),
    expect    = require('chai').expect,
    rewire    = require('rewire'),
    Collector = rewire('./collector'),
    _         = require('./../common/util/wrapper'),
    _storage  = [];

chai.use(require('chai-spies'));


describe('Collector', function () {
    let div, a1, a2, span1, span2, p, a3, span3,
        storageSpy,
        storageMock,
        loggerSpy,
        loggerMock;
    before(function () {
        div = document.createElement('div');
        div.setAttribute('id', 'fight-club');
        document.querySelector('body').appendChild(div);
        a1 = document.createElement('a');
        a1.classList.add('fight');
        a1.textContent = 'fight!';
        div.appendChild(a1);
        a2             = document.createElement('a');
        a2.textContent = 'Hide :-(';
        div.appendChild(a2);
        span1             = document.createElement('span');
        span1.textContent = 'don\'t talk about fight club';
        div.appendChild(span1);
        span2             = document.createElement('span');
        span2.textContent = 'If this is your first night in fight club, you HAVE to fight.';
        div.appendChild(span2);
        p              = document.createElement('p');
        p.textContent  = 'YES';
        a3             = document.createElement('a');
        a3.textContent = 'first night';
        p.appendChild(a3);
        span3             = document.createElement('span');
        span3.textContent = 'no shirts';
        p.appendChild(span3);
        div.appendChild(p);
        div.appendChild(p.cloneNode(true));
        storageMock = {
            'save': _saveMockFn
        };
        Collector.__set__({
                              '_storage': storageMock
                          });
        storageSpy = chai.spy.on(storageMock, 'save');
        loggerMock = {
            'log': _logMockFn
        };
        Collector.__set__({
                              'Logger': loggerMock
                          });
        loggerSpy = chai.spy.on(loggerMock, 'log');
        Collector.__set__({
                              'Client': {
                                  agent: {
                                      os     : 'Mac',
                                      browser: 'Safari'
                                  }
                              }
                          });
    });
    after(function () {
        div.parentNode.removeChild(div);
    });
    beforeEach(function () {
        loggerSpy.reset();
        storageSpy.reset();
        _storage = [];
    });
    afterEach(function () {
        loggerSpy.reset();
        storageSpy.reset();
        _storage = [];
    });
    it('save a subject', function () {
        Collector.collect({dataProps: [{name: 'rule', selector: '#fight-club>span'}]});
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.have.length(1);
        expect(_storage[0]).to.include.keys('subject');
        expect(_storage[0].subject).to.include.keys('rule');
        expect(_storage[0].subject.rule).to.equal(span1.textContent);
    });
    it('save a subject with client', function () {
        Collector.collect({
                              dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                              client   : {
                                  properties: ['agent.os', 'agent.browser', 'agent.other-property']
                              }
                          });
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.have.length(1);
        expect(_storage[0]).to.include.keys('client');
        expect(_storage[0].client).to.include.keys('agent');
        expect(_storage[0].client.agent).to.include.keys('os', 'browser');
        expect(_storage[0].client.agent.os).to.equal('Mac');
        expect(_storage[0].client.agent.browser).to.equal('Safari');
        expect(_storage[0].client.agent).to.not.include.keys('other-property');
    });
    it('save a subject with anchor', function (done) {
        Collector.collect({
                              dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                              anchor   : {selector: '#fight-club>a.fight', event: 'click'}
                          });
        a1.click();
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.have.length(1);
        expect(_storage[0]).to.include.keys('subject', 'anchor');
        expect(_storage[0].subject).to.include.keys('rule');
        expect(_storage[0].subject.rule).to.equal(span1.textContent);
        expect(_storage[0].anchor).to.include.keys('event', 'selector', 'targetText');
        expect(_storage[0].anchor.event).to.equal('click');
        expect(_storage[0].anchor.selector).to.equal('#fight-club>a.fight');
        expect(_storage[0].anchor.targetText).to.equal(a1.textContent);
        done();
    });
    it('iterative selector', function (done) {
        Collector.collect({
                              dataProps   : [{name: 'look', selector: 'span'}],
                              anchor      : {selector: 'a', event: 'click'},
                              iterSelector: '#fight-club>p'
                          });
        document.querySelectorAll('#fight-club>p>a').forEach(function (a) {
            a.click();
        });
        expect(storageSpy).to.have.been.called(2);
        expect(_storage).to.have.length(2);
        _.forEach(_storage, function (item) {
            expect(item).to.include.keys('subject', 'anchor');
            expect(item.subject).to.include.keys('look');
            expect(item.subject.look).to.equal(span3.textContent);
            expect(item.anchor).to.include.keys('event', 'selector', 'targetText');
            expect(item.anchor.event).to.equal('click');
            expect(item.anchor.selector).to.equal('a');
            expect(item.anchor.targetText).to.equal(a3.textContent);
        });
        done();
    });
    it('save a subject with anchor with multiple targets', function (done) {
        Collector.collect({
                              dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                              anchor   : {selector: '#fight-club>span', event: 'click'}
                          });
        span1.click();
        span2.click();
        expect(storageSpy).to.have.been.called(2);
        expect(_storage).to.have.length(2);
        done();
    });
    it('failed to select subject', function () {
        Collector.collect(
            {dataProps: [{name: 'rule', selector: '#fight-club>span.non-existing-class'}]});
        expect(storageSpy).to.not.have.been.called();
        expect(_storage).to.be.empty;
        expect(loggerSpy).to.have.been.called();
    });
    it('failed to select anchor', function () {
        Collector.collect({anchor: {selector: '#effi', event: 'click'}});
        expect(storageSpy).to.not.have.been.called();
        expect(_storage).to.be.empty;
        expect(loggerSpy).to.have.been.called();
    });
    it('missing event name', function () {
        Collector.collect({
                              dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                              anchor   : {selector: '#fight-club>a'}
                          });
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.have.length(1);
        expect(loggerSpy).to.have.been.called();
    });
    it('client is empty', function (done) {
        Collector.collect({
                              dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                              anchor   : {selector: '#fight-club>p', event: 'click'},
                              client   : []
                          });
        p.click();
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.have.length(1);
        expect(_storage[0]).to.not.include.keys('client');
        expect(loggerSpy).to.have.been.called();
        done();
    });
    it('client properties not found', function (done) {
        Collector.collect({
                              dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                              anchor   : {
                                  selector: '#fight-club>a:last-of-type', event: 'click'
                              },
                              client   : {properties: ['some-prop', 'agent.garbage']}
                          });
        a2.click();
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.have.length(1);
        expect(_storage[0]).to.not.include.keys('client');
        expect(loggerSpy).to.have.been.called();
        done();
    });
});

function _saveMockFn() {
    _storage.push(arguments[0]);
}

function _logMockFn() {
    console.log(JSON.stringify(arguments[1]))
}