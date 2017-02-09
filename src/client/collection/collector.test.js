/**
 * Proudly created by ohad on 18/12/2016.
 */
let chai            = require('chai'),
    expect          = require('chai').expect,
    Client          = require('../common/client'),
    Collector       = require('./collector'),
    _               = require('../common/util/wrapper'),
    Storage         = require('../common/storage/storage'),
    InMemoryStorage = require('../common/storage/in-memory.storage');

chai.use(require('chai-spies'));

describe('Collector', function () {
  this.timeout(100);
  let div, a1, a2, span1, span2, p, a3, span3, id = 0, agentTmp;
  before(() => {
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
    agentTmp             = JSON.parse(JSON.stringify(Client.agent));
    Client.agent.os      = 'Mac';
    Client.agent.browser = 'Safari';
    Storage.set(Storage.names.IN_MEMORY);
  });
  after(() => {
    Client.agent = agentTmp;
    div.parentNode.removeChild(div);
  });
  beforeEach(() => {
    ++id;
    InMemoryStorage.flush();
  });
  afterEach(() => {
    InMemoryStorage.flush();
  });
  it('save a subject', () => {
    Collector.collect({dataProps: [{name: 'rule', selector: '#fight-club>span'}]});
    expect(_countSubjects()).to.equal(1);
    expect(InMemoryStorage.storage[0]).to.include.keys('subject');
    expect(InMemoryStorage.storage[0].subject).to.include.keys('rule');
    expect(InMemoryStorage.storage[0].subject.rule).to.equal(span1.textContent);
  });
  it('save a subject with client', () => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        client   : {
                          properties: ['agent.os', 'agent.browser', 'agent.other-property']
                        }
                      });
    expect(_countSubjects()).to.equal(1);
    expect(InMemoryStorage.storage[0]).to.include.keys('client');
    expect(InMemoryStorage.storage[0].client).to.include.keys('agent');
    expect(InMemoryStorage.storage[0].client.agent).to.include.keys('os', 'browser');
    expect(InMemoryStorage.storage[0].client.agent.os).to.equal('Mac');
    expect(InMemoryStorage.storage[0].client.agent.browser).to.equal('Safari');
    expect(InMemoryStorage.storage[0].client.agent).to.not.include.keys('other-property');
  });
  it('save a subject with anchor', (done) => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {selector: '#fight-club>a.fight', event: id.toString()}
                      });
    _.trigger(id.toString(), {}, a1);
    setTimeout(() => {
      expect(_countSubjects()).to.equal(1);
      expect(InMemoryStorage.storage[0]).to.include.keys('subject', 'anchor');
      expect(InMemoryStorage.storage[0].subject).to.include.keys('rule');
      expect(InMemoryStorage.storage[0].subject.rule).to.equal(span1.textContent);
      expect(InMemoryStorage.storage[0].anchor).to.include
                                               .keys('event', 'selector', 'targetText');
      expect(InMemoryStorage.storage[0].anchor.event).to.equal(id.toString());
      expect(InMemoryStorage.storage[0].anchor.selector).to.equal('#fight-club>a.fight');
      expect(InMemoryStorage.storage[0].anchor.targetText).to.equal(a1.textContent);
      done();
    });
  });
  it('save once = true', (done) => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {
                          selector: '#fight-club>a.fight', event: id.toString(), once: true
                        }
                      });
    _.trigger(id.toString(), {}, a1);
    setTimeout(() => {
      _.trigger(id.toString(), {}, a1);
      setTimeout(() => {
        expect(_countSubjects()).to.equal(1);
        done();
      });
    });
  });
  it('save once = false', (done) => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {
                          selector: '#fight-club>a.fight', event: id.toString(), once: false
                        }
                      });
    _.trigger(id.toString(), {}, a1);
    setTimeout(() => {
      _.trigger(id.toString(), {}, a1);
      setTimeout(() => {
        expect(_countSubjects()).to.equal(2);
        done();
      });
    }, 10);
  });
  it('iterative selector', (done) => {
    Collector.collect({
                        dataProps   : [{name: 'look', selector: 'span'}],
                        anchor      : {selector: 'a', event: id.toString()},
                        iterSelector: '#fight-club>p'
                      });
    document.querySelectorAll('#fight-club>p>a').forEach(function (a) {
      _.trigger(id.toString(), {}, a);
    });
    expect(_countSubjects()).to.equal(2);
    for (let i = 0; i < InMemoryStorage.storage.length; i++) {
      expect(InMemoryStorage.storage[i]).to.include.keys('subject', 'anchor');
      expect(InMemoryStorage.storage[i].subject).to.include.keys('look');
      expect(InMemoryStorage.storage[i].subject.look).to.equal(span3.textContent);
      expect(InMemoryStorage.storage[i].anchor).to.include
                                               .keys('event', 'selector', 'targetText');
      expect(InMemoryStorage.storage[i].anchor.event).to.equal(id.toString());
      expect(InMemoryStorage.storage[i].anchor.selector).to.equal('a');
      expect(InMemoryStorage.storage[i].anchor.targetText).to.equal(a3.textContent);
    }
    done();
  });
  it('save a subject with anchor with multiple targets', (done) => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {selector: '#fight-club>span', event: id.toString()}
                      });
    _.trigger(id.toString(), {}, span1);
    _.trigger(id.toString(), {}, span2);
    setTimeout(() => {
      expect(_countSubjects()).to.equal(2);
      done();
    });
  });
  it('failed to select subject', () => {
    Collector.collect(
      {dataProps: [{name: 'rule', selector: '#fight-club>span.non-existing-class'}]});
    expect(_countSubjects()).to.equal(0);
  });
  it('failed to select anchor', () => {
    Collector.collect({anchor: {selector: '#effi', event: id.toString()}});
    expect(_countSubjects()).to.equal(0);
  });
  it('missing event name', () => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {selector: '#fight-club>a'}
                      });
    expect(_countSubjects()).to.equal(1);
  });
  it('client is empty', (done) => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {selector: '#fight-club>p', event: id.toString()},
                        client   : []
                      });
    _.trigger(id.toString(), {}, p);
    setTimeout(() => {
      expect(_countSubjects()).to.equal(1);
      expect(InMemoryStorage.storage[0]).to.not.include.keys('client');
      done();
    });
  });
  it('client properties not found', (done) => {
    Collector.collect({
                        dataProps: [{name: 'rule', selector: '#fight-club>span'}],
                        anchor   : {
                          selector: '#fight-club>a:last-of-type', event: id.toString()
                        },
                        client   : {properties: ['some-prop', 'agent.garbage']}
                      });
    _.trigger(id.toString(), {}, a2);
    setTimeout(() => {
      expect(_countSubjects()).to.equal(1);
      expect(InMemoryStorage.storage[0]).to.not.include.keys('client');
      done();
    });
  });
});

/**
 * @returns {number} of non-log messages in InMemoryStorage.
 * @private
 */
function _countSubjects() {
  let count = 0;
  for (let i = 0; i < InMemoryStorage.storage.length; i++) {
    if (InMemoryStorage.storage[i].type !== 'log') count++;
  }
  return count;
}
