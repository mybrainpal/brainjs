/**
 * Proudly created by ohad on 20/12/2016.
 */
let $             = require('./../common/util/dom'),
    expect        = require('chai').expect,
    chai          = require('chai'),
    Manipulator   = require('./manipulator'),
    StyleExecutor = require('./execute/dom/style'),
    Demographics  = require('./experiment/demographics'),
    Experiment    = require('./experiment/experiment'),
    Storage       = require('../common/storage/storage'),
    InMemory      = require('../common/storage/in-memory.storage'),
    Const         = require('../../common/const');

chai.use(require('chai-spies'));

describe('Manipulator', function () {
  let clientGroup, clientGroup2, nonClientGroup, nonClientDemographics,
      collect, id,
      div, span;
  before(() => {
    id = 0;
    Storage.set(Storage.names.IN_MEMORY);
    InMemory.flush();
    div = $.div({id: 'branson'},
                span = $.span('Screw it'),
                $.a('let\'s do it!'));
    $('body').appendChild(div);
    collect               = {selector: '#branson>a', event: 'click'};
    nonClientDemographics = [{
      name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1
    }];
    clientGroup           = {
      id       : 1,
      label    : 'client',
      executors: [
        {
          name   : StyleExecutor.name,
          options: {css: '#branson>span {margin-top: 10px}'}
        }
      ],
    };
    clientGroup2          = {
      id       : 2,
      label    : 'client2',
      executors: [
        {
          name   : StyleExecutor.name,
          options: {css: '#branson>span {margin-left: 10px}'}
        }
      ],
    };
    nonClientGroup        = {
      id          : 3,
      label       : 'non-client',
      executors   : [
        {
          name   : StyleExecutor.name,
          options: {css: '#branson>span {margin-bottom: 10px}'}
        }
      ],
      demographics: nonClientDemographics
    };
  });
  afterEach(() => {
    InMemory.flush();
    // Clean all injected styles.
    document.querySelectorAll('style[' + $.identifyingAttribute + ']')
            .forEach(function (styleElement) {
              styleElement.parentNode.removeChild(styleElement);
            });
    id++;
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('experiment runs', () => {
    Manipulator.experiment(new Experiment({id: id, groups: [clientGroup, nonClientGroup]}));
    expect(_countEvents()).to.eq(2);
    // Participation in experiment.
    expect(_get(0).experimentId).to.eq(id);
    expect(_get(0).event).to.eq(Const.EVENTS.PARTICIPATE);
    // Participation in group.
    expect(_get(1).experimentGroupId).to.eq(clientGroup.id);
    expect(_get(1).event).to.eq(Const.EVENTS.PARTICIPATE);
    // Manipulations run.
    expect(getComputedStyle(span).marginTop).to.eq('10px');
    // Manipulations doesn't run for non client groups.
    expect(getComputedStyle(span).marginBottom).to.eq('0px');
  });
  it('client not included in experiment', () => {
    Manipulator.experiment(
      new Experiment({id: id, demographics: nonClientDemographics, groups: [nonClientGroup]}));
    expect(_countEvents()).to.eq(0);
    // Manipulations does not run.
    expect(getComputedStyle(span).marginTop).to.eq('0px');
    expect(getComputedStyle(span).marginBottom).to.eq('0px');
  });
  it('experiment with collect', (done) => {
    Manipulator.experiment(new Experiment({id: id, groups: [clientGroup]}), collect);
    // Participation in experiment.
    expect(_get(0).experimentId).to.eq(id);
    expect(_get(0).event).to.eq(Const.EVENTS.PARTICIPATE);
    // Participation in group.
    expect(_get(1).experimentGroupId).to.eq(clientGroup.id);
    expect(_get(1).event).to.eq(Const.EVENTS.PARTICIPATE);
    // Manipulations run.
    expect(getComputedStyle(span).marginTop).to.eq('10px');
    // Triggers collection
    $.trigger(collect.event, id, '#branson>a');
    setTimeout(() => {
      const msg = _last();
      expect(msg.experimentId).to.eq(id);
      expect(msg.experimentGroupId).to.eq(clientGroup.id);
      expect(msg.event).to.eq(collect.event);
      expect(msg.selector).to.eq(collect.selector);
      done();
    });
  });
  it('experiment without group participation', () => {
    Manipulator.experiment(new Experiment({id: id, groups: [nonClientGroup]}));
    // Non-participation in group.
    expect(_countEvents()).to.eq(1);
    // Participation in experiment.
    expect(_get(0).experimentId).to.eq(id);
    expect(_get(0).event).to.eq(Const.EVENTS.PARTICIPATE);
    // Manipulations doesn't run.
    expect(getComputedStyle(span).marginTop).to.eq('0px');
  });
  it('experiment without group participation, but with collect', (done) => {
    Manipulator.experiment(new Experiment({id: id, groups: [nonClientGroup]}), collect);
    $.trigger(collect.event, id, '#branson>a');
    setTimeout(() => {
      const msg = _last();
      expect(msg.experimentId).to.eq(id);
      expect(msg.experimentGroupId).to.not.be.ok;
      expect(msg.event).to.eq(collect.event);
      expect(msg.selector).to.eq(collect.selector);
      done();
    });
  });
  it('experiment with multiple groups', (done) => {
    Manipulator.experiment(new Experiment({id: id, groups: [clientGroup, clientGroup2]}), collect);
    // Participation in both group.
    expect(_get(1).experimentGroupId).to.eq(clientGroup.id);
    expect(_get(1).event).to.eq(Const.EVENTS.PARTICIPATE);
    expect(_get(2).experimentGroupId).to.eq(clientGroup2.id);
    expect(_get(2).event).to.eq(Const.EVENTS.PARTICIPATE);
    $.trigger(collect.event, id, '#branson>a');
    setTimeout(() => {
      // Both manipulations run
      expect(getComputedStyle(span).marginTop).to.eq('10px');
      expect(getComputedStyle(span).marginLeft).to.eq('10px');
      done();
    });
  });
});

/**
 * @returns {number} of non-log messages in InMemoryStorage.
 * @private
 */
function _countEvents() {
  let count = 0;
  for (let i = 0; i < InMemory.storage.length; i++) {
    if (InMemory.storage[i].backendUrl === Const.BACKEND_URL.EVENT) count++;
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
  for (let j = 0; j < InMemory.storage.length; j++) {
    if (InMemory.storage[j].backendUrl === Const.BACKEND_URL.EVENT) count++;
    if (count === i + 1) return InMemory.storage[j];
  }
}

/**
 * @returns {Object} the last message of type event from InMemory storage.
 * @private
 */
function _last() {
  let last;
  for (let j = 0; j < InMemory.storage.length; j++) {
    if (InMemory.storage[j].backendUrl === Const.BACKEND_URL.EVENT) last = InMemory.storage[j];
  }
  return last;
}
