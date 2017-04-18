/**
 * @author ohad
 * Proudly on 09/04/2017.
 */
const expect        = require('chai').expect,
      sinon         = require('sinon'),
      Play          = require('./play'),
      _             = require('./common/util/wrapper'),
      $             = require('./common/util/dom'),
      BaseError     = require('./common/log/base.error'),
      Client        = require('./common/client'),
      Experiment    = require('./manipulation/experiment/experiment'),
      StyleExecutor = require('./manipulation/execute/dom/style'),
      Demographics  = require('./manipulation/experiment/demographics'),
      Storage       = require('./common/storage/storage'),
      Const         = require('../common/const');

describe('End 2 End', function () {
  this.timeout(1000);
  /**
   * Experiment options in which the client should participate.
   * @type {Object}
   */
  let clientExperiment;
  /**
   * Experiment options in which the client should not participate.
   * @type {Object}
   */
  let nonClientExperiment;
  /**
   * Subject to collect data about.
   * @type {Object}
   */
  let collect;
  /**
   * Unit test ID.
   * @type {number}
   */
  let id;
  /**
   * @type {Element} DOM elements that take part in the test.
   */
  let div, span;
  before(() => {
    id  = 0;
    div = $.div({id: 'les-brown'},
                span = $.span('it\'s not over'),
                $.a('until you win'));
    $('body').appendChild(div);
    collect             = {
      selector: '#les-brown>a', event: 'click', state: Const.STATES.CONVERSION
    };
    clientExperiment    = {
      id     : 1,
      groups : [
        {
          id       : 1,
          executors: [
            {
              name   : StyleExecutor.name,
              options: {css: '#les-brown>span {margin-top: 10px}'}
            }
          ],
        }
      ],
      collect: collect
    };
    nonClientExperiment = {
      id     : 2,
      groups : [
        {
          id          : 2,
          executors   : [
            {
              name   : StyleExecutor.name,
              options: {css: '#les-brown>span {margin-left: 10px}'}
            }
          ],
          demographics: {name: Demographics.PROPERTIES.MODULO.name, moduloIds: [], moduloOf: 1}
        }
      ],
      collect: collect
    };
  });
  beforeEach(function () {
    this.xhr          = sinon.useFakeXMLHttpRequest();
    this.requests     = [];
    this.xhr.onCreate = function (xhr) {
      this.requests.push(xhr);
    }.bind(this);
    Storage.set(Storage.names.IN_MEMORY);

  });
  afterEach(function () {
    this.xhr.restore();
    // Clean all injected styles.
    document.querySelectorAll('style[' + $.identifyingAttribute + ']')
            .forEach(function (styleElement) {
              styleElement.parentNode.removeChild(styleElement);
            });
    id++;
    collect.event      = 'click-' + id;
    Client.trackerId   = '';
    Client.experiments = [];
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('can\'t run brainpal', function () {
    const tmp       = Client.agent.os;
    Client.agent.os = 'BrainOs';
    // So that we can ensure shut down.
    $.load('a {}');
    Play({experiments: [clientExperiment]});
    expect(this.requests).to.have.length(0);
    expect(getComputedStyle(span).marginTop).to.eq('0px');
    Client.agent.os = tmp;
    expect($('style[' + $.identifyingAttribute + ']')).to.not.be.ok;
  });
  it('tracker initialized', () => {
    Play({trackerId: `it's you`});
    expect(Client.trackerId).to.eq(`it's you`);
  });
  it('missing tracker ID', () => {
    expect(() => {Play({})}).to.throw(BaseError);
  });
  it('invalid configuration', () => {
    expect(() => {//noinspection JSCheckFunctionSignatures
      Play()
    }).to.throw(BaseError);
    expect(() => {Play(1)}).to.throw(BaseError);
  });
  it('experiments initialized', () => {
    Play({trackerId: id, experiments: [nonClientExperiment]});
    expect(Client.experiments).to.deep.eq([new Experiment(nonClientExperiment)]);
  });
  it('client init & storage switch', function (done) {
    Play({trackerId: id, storage: {name: Storage.names.POST}});
    expect(this.requests).to.not.be.empty;
    // Simulates a non-zero response time from the backend.
    _.delay.call(this, () => {
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1, json: 1, csrf_token: 'miami'}));
    }, 10);
    _.delay.call(this, () => {
      expect(this.requests[0].requestBody.get('participates')).to.eq('0');
      expect(this.requests[0].requestBody.get('manipulated')).to.eq('0');
      expect(this.requests[0].requestBody.get('tracker_id')).to.eq(id.toString());
      expect(_.http.csrfToken).to.eq('miami');
      expect(this.requests[1].url.endsWith(Const.BACKEND_URL.LOG)).to.be.true;
      expect(this.requests[1].requestBody.get('token')).to.eq('miami');
      done();
    }, 20);
  });
  it('experiment run', function (done) {
    Play({trackerId: id, storage: {name: Storage.names.POST}, experiments: [clientExperiment]});
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 'florida'}));
    expect(this.requests[0].requestBody.get('participates')).to.eq('1');
    expect(this.requests[0].requestBody.get('manipulated')).to.eq('1');
    _.delay.call(this, () => {
      expect(getComputedStyle(span).marginTop).to.eq('10px');
      expect(_getEvent(0, this.requests).requestBody.get('event')).to.eq(Const.EVENTS.PARTICIPATE);
      expect(_getEvent(1, this.requests).requestBody.get('experiment_id')).to.eq(
        clientExperiment.id.toString());
      expect(_getEvent(1, this.requests).requestBody.get('event')).to.eq(Const.EVENTS.PARTICIPATE);
      expect(_getEvent(1, this.requests).requestBody.get('experiment_group_id')).to.eq(
        clientExperiment.groups[0].id.toString());
      done();
    });
  });
  it('conversion / state change', function (done) {
    Play({trackerId: id, storage: {name: Storage.names.POST}, experiments: [clientExperiment]});
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 'token'}));
    $.trigger(collect.event, null, collect.selector);
    _.delay.call(this, () => {
      expect(_getEvent(2, this.requests).requestBody.get('event')).to.eq(collect.event);
      expect(_getEvent(2, this.requests).requestBody.get('selector')).to.eq(collect.selector);
      expect(this.requests[this.requests.length - 1].requestBody.get('state')).to.eq(collect.state);
      expect(
        this.requests[this.requests.length - 1].url.endsWith(Const.BACKEND_URL.UPDATE)).to.be.true;
      done();
    });
  });
  it('non-client experiment does not manipulate', function (done) {
    Play({trackerId: id, storage: {name: Storage.names.POST}, experiments: [nonClientExperiment]});
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 'florida'}));
    expect(this.requests[0].requestBody.get('participates')).to.eq('1');
    expect(this.requests[0].requestBody.get('manipulated')).to.eq('0');
    _.delay.call(this, () => {
      expect(getComputedStyle(span).marginTop).to.eq('0px');
      done();
    });
  });
  it('collect', function (done) {
    Play({trackerId: id, storage: {name: Storage.names.POST}, collect: collect});
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 'florida'}));
    $.trigger(collect.event, null, collect.selector);
    _.delay.call(this, () => {
      expect(_getEvent(0, this.requests).requestBody.get('event')).to.eq(collect.event);
      expect(_getEvent(0, this.requests).requestBody.get('selector')).to.eq(collect.selector);
      done();
    });
  });
});

/**
 * @param {number} i
 * @param {Array.<Object>} mockedRequests
 * @returns {Object} the i-th message of type event from mocked Ajax requests.
 * @private
 */
function _getEvent(i, mockedRequests) {
  let count = 0;
  for (let j = 0; j < mockedRequests.length; j++) {
    if (mockedRequests[j].url.endsWith(Const.BACKEND_URL.EVENT)) count++;
    if (count === i + 1) return mockedRequests[j];
  }
}