/**
 * Proudly created by ohad on 18/12/2016.
 */
var chai      = require('chai'),
    expect    = require('chai').expect,
    rewire    = require('rewire'),
    Collector = rewire('./collector'),
    _storage  = [];

chai.use(require('chai-spies'));


describe('Collector', function () {
    var div, a, span, p,
        storageSpy,
        storageMock,
        loggerSpy,
        loggerMock;
    before(function () {
        div = document.createElement('div');
        div.setAttribute('id', 'fight-club');
        document.querySelector('body').appendChild(div);
        a             = document.createElement('a');
        a.textContent = 'fight!';
        div.appendChild(a);
        span             = document.createElement('span');
        span.textContent = 'don\'t talk about fight club';
        p                = document.createElement('p');
        p.textContent    = 'YES';
        div.appendChild(p);
        div.appendChild(span);
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
    afterEach(function () {
        loggerSpy.reset();
        storageSpy.reset();
        _storage = [];
    });

    it('save a subject', function () {
        Collector.collect([{name: 'rule', selector: '#fight-club>span'}]);
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.not.be.empty;
        expect(_storage[0]).to.include.keys('subject');
        expect(_storage[0].subject).to.include.keys('rule');
        expect(_storage[0].subject.rule).to.equal(span.textContent);
    });
    it('save a subject with client', function () {
        Collector.collect([{name: 'rule', selector: '#fight-club>span'}], {},
                          {
                              client: {
                                  properties: ['agent.os', 'agent.browser', 'agent.other-property']
                              }
                          });
        expect(storageSpy).to.have.been.called.once;
        expect(_storage).to.not.be.empty;
        expect(_storage[0]).to.include.keys('client');
        expect(_storage[0].client).to.include.keys('agent');
        expect(_storage[0].client.agent).to.include.keys('os', 'browser');
        expect(_storage[0].client.agent.os).to.equal('Mac');
        expect(_storage[0].client.agent.browser).to.equal('Safari');
        expect(_storage[0].client.agent).to.not.include.keys('other-property');
    });
    it('save a subject with anchor', function (done) {
        Collector.collect([{name: 'rule', selector: '#fight-club>span'}],
                          {selector: '#fight-club>a', event: 'click'});
        a.click();
        // anonymous function ensures click handler is executed first.
        (function () {
            expect(storageSpy).to.have.been.called.once;
            expect(_storage).to.not.be.empty;
            expect(_storage[0]).to.include.keys('subject', 'anchor');
            expect(_storage[0].subject).to.include.keys('rule');
            expect(_storage[0].subject.rule).to.equal(span.textContent);
            expect(_storage[0].anchor).to.include.keys('event', 'target', 'targetText');
            expect(_storage[0].anchor.event).to.equal('click');
            expect(_storage[0].anchor.target).to.equal('#fight-club>a');
            expect(_storage[0].anchor.targetText).to.equal(a.textContent);
            done();
        })();
    });
    it('failed to select subject', function () {
        Collector.collect([{name: 'rule', selector: '#fight-club>span.non-existing-class'}]);
        expect(storageSpy).to.not.have.been.called();
        expect(_storage).to.be.empty;
        expect(loggerSpy).to.have.been.called();
    });
    it('failed to select anchor', function () {
        Collector.collect([], {selector: '#effi'});
        expect(storageSpy).to.not.have.been.called();
        expect(_storage).to.be.empty;
        expect(loggerSpy).to.have.been.called();
    });
    it('missing event name', function () {
        Collector.collect([{name: 'rule', selector: '#fight-club>span'}],
                          {selector: '#fight-club>a'});
        expect(storageSpy).to.not.have.been.called();
        expect(_storage).to.be.empty;
        expect(loggerSpy).to.have.been.called();
    });
    it('client is empty', function (done) {
        Collector.collect([{name: 'rule', selector: '#fight-club>span'}],
                          {selector: '#fight-club>a', event: 'click'},
                          {client: []});
        a.click();
        // anonymous function ensures click handler is executed first.
        (function () {
            expect(storageSpy).to.have.been.called();
            expect(_storage).to.not.be.empty;
            expect(_storage[0]).to.not.include.keys('client');
            expect(loggerSpy).to.have.been.called();
            done();
        })();
    });
    it('client properties not found', function (done) {
        Collector.collect([{name: 'rule', selector: '#fight-club>span'}],
                          {selector: '#fight-club>a', event: 'click'},
                          {client: {properties: ['some-prop', 'agent.garbage']}});
        a.click();
        // anonymous function ensures click handler is executed first.
        (function () {
            expect(storageSpy).to.have.been.called();
            expect(_storage).to.not.be.empty;
            expect(_storage[0]).to.not.include.keys('client');
            expect(loggerSpy).to.have.been.called();
            done();
        })();
    });
});

function _saveMockFn() {
    _storage.push(arguments[0]);
}

function _logMockFn() {
    console.log(JSON.stringify(arguments[1]))
}