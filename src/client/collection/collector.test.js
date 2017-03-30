/**
 * Proudly created by ohad on 18/12/2016.
 */
let expect          = require('chai').expect,
    Collector       = require('./collector'),
    $               = require('../common/util/dom'),
    BaseError       = require('../common/log/base.error'),
    Storage         = require('../common/storage/storage'),
    InMemoryStorage = require('../common/storage/in-memory.storage'),
    Experiment      = require('../manipulation/experiment/experiment'),
    Const           = require('../../common/const');

describe('Collector', function () {
  this.timeout(100);
  let div, id = 0, experiment, group;
  before(() => {
    div        = $.div({id: 'fight-club'},
                       $.a({class: 'fight'}, 'fight!'),
                       $.a('Hide :-('),
                       $.span('don\'t talk about fight club'),
                       $.span('If this is your first night in fight club, you HAVE to fight.'),
                       $.p('YES',
                           $.a('first night'),
                           $.span('no shirts')),
                       $.p('YES',
                           $.a('first night'),
                           $.span('no shirts')));
    experiment = new Experiment({id: 1, groups: [{id: 10}]});
    $('body').appendChild(div);
    Storage.set(Storage.names.IN_MEMORY);
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  beforeEach(() => {
    ++id;
    InMemoryStorage.flush();
  });
  afterEach(() => {
    InMemoryStorage.flush();
  });
  it('listen = false', () => {
    Collector.collect({event: 'first-night', listen: false});
    expect(_countEvents()).to.equal(1);
    expect(_get(0).event).to.eq('first-night');
    expect(_get(0).backendUrl).to.eq(Const.BACKEND_URL.EVENT);
  });
  it('save an experiment ID', () => {
    Collector.collect({event: 'dual-personality', experiment: experiment, listen: false});
    expect(_get(0).experimentId).to.eq(1);
  });
  it('save a group ID', () => {
    Collector.collect(
      {event: 'dual-personality', experimentGroup: experiment.groups[0], listen: false});
    expect(_get(0).experimentGroupId).to.eq(10);
  });
  it('DOM event', (done) => {
    Collector.collect({selector: '#fight-club>a.fight', event: id.toString()});
    $.trigger(id.toString(), {}, '#fight-club>a.fight');
    setTimeout(() => {
      expect(_countEvents()).to.equal(1);
      expect(_get(0).event).to.eq(id.toString());
      done();
    });
  });
  it('once = true', (done) => {
    Collector.collect({selector: '#fight-club>a.fight', event: id.toString(), once: true});
    $.trigger(id.toString(), {}, '#fight-club>a.fight');
    setTimeout(() => {
      $.trigger(id.toString(), {}, '#fight-club>a.fight');
      setTimeout(() => {
        expect(_countEvents()).to.equal(1);
        done();
      });
    }, 10);
  });
  it('once = false', (done) => {
    Collector.collect({selector: '#fight-club>a.fight', event: id.toString(), once: false});
    $.trigger(id.toString(), {}, '#fight-club>a.fight');
    setTimeout(() => {
      $.trigger(id.toString(), {}, '#fight-club>a.fight');
      setTimeout(() => {
        expect(_countEvents()).to.equal(2);
        done();
      });
    }, 10);
  });
  it('multiple dom event targets', (done) => {
    Collector.collect({selector: '#fight-club>span', event: id.toString()});
    $.trigger(id.toString(), {}, '#fight-club>span:first-of-type');
    $.trigger(id.toString(), {}, '#fight-club>span:nth-of-type(2)');
    setTimeout(() => {
      expect(_countEvents()).to.equal(2);
      done();
    });
  });
  it('failed to select', () => {
    Collector.collect({selector: '#effi', event: id.toString()});
    expect(_countEvents()).to.equal(0);
  });
  it('empty options throws', () => {
    expect(() => {//noinspection JSCheckFunctionSignatures
      Collector.collect()
    }).to.throw(BaseError);
    expect(() => {Collector.collect({})}).to.throw(BaseError);
  });
  it('illegal event throws', () => {
    expect(() => {Collector.collect({event: 1})}).to.throw(BaseError);
    expect(() => {Collector.collect({event: ''})}).to.throw(BaseError);
  });
  it('illegal selector throws', () => {
    expect(() => {Collector.collect({event: 'a', listen: true, selector: 1})}).to.throw(BaseError);
  });
});

/**
 * @returns {number} of non-log messages in InMemoryStorage.
 * @private
 */
function _countEvents() {
  let count = 0;
  for (let i = 0; i < InMemoryStorage.storage.length; i++) {
    if (InMemoryStorage.storage[i].backendUrl === Const.BACKEND_URL.EVENT) count++;
  }
  return count;
}

/**
 * @param {number} i
 * @returns {Object} the i-th message of type event from InMemory storage.
 * @private
 */
function _get(i) {
  let count = 0;
  for (let j = 0; j < InMemoryStorage.storage.length; j++) {
    if (InMemoryStorage.storage[j].backendUrl === Const.BACKEND_URL.EVENT) count++;
    if (count === i + 1) return InMemoryStorage.storage[j];
  }
}
