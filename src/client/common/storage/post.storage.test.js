/**
 * Proudly created by ohad on 29/03/2017.
 */
const expect       = require('chai').expect,
      sinon        = require('sinon'),
      Client       = require('../../common/client'),
      _            = require('../../common/util/wrapper'),
      Demographics = require('../../manipulation/experiment/demographics'),
      Experiment   = require('../../manipulation/experiment/experiment'),
      PostStorage  = require('./post.storage');

describe('PostStorage', function () {
  this.timeout(100);
  /**
   * Experiment options in which the client participates and manipulated.
   * @type {Experiment}
   */
  let manipulatedExperiment;
  /**
   * Experiment options in which the client participates, but not manipulated.
   * @type {Experiment}
   */
  let onlyParticipatesExperiment;
  /**
   * Experiment options in which the client should not participate (and hence not manipulated).
   * @type {Experiment}
   */
  let notParticipatesExperiment;
  before(() => {
    Client.tracker             = 'MC hammer';
    manipulatedExperiment      = new Experiment({id: 1, groups: [{id: 1}]});
    onlyParticipatesExperiment = new Experiment({
                                                  id    : 1,
                                                  groups: [{
                                                    id: 1, demographics: {
                                                      name     : Demographics.PROPERTIES.MODULO.name,
                                                      moduloIds: [], moduloOf: 1
                                                    }
                                                  }]
                                                });
    notParticipatesExperiment  = new Experiment({
                                                  id          : 2,
                                                  groups      : [
                                                    {
                                                      id: 2
                                                    }
                                                  ],
                                                  demographics: {
                                                    name     : Demographics.PROPERTIES.MODULO.name,
                                                    moduloIds: [], moduloOf: 1
                                                  }
                                                });
  });
  beforeEach(function () {
    this.xhr          = sinon.useFakeXMLHttpRequest();
    this.requests     = [];
    this.xhr.onCreate = function (xhr) {
      this.requests.push(xhr);
    }.bind(this);
  });
  afterEach(function () {
    this.xhr.restore();
    Client.experiments = [];
  });
  it('init without experiments', function (done) {
    PostStorage.init({}, () => {
      expect(_.http.csrf_token).to.eq('10');
      done();
    });
    expect(this.requests).to.have.length(1);
    expect(this.requests[0].requestBody.get('tracker')).to.eq(Client.tracker);
    expect(this.requests[0].requestBody.get('timestamp')).to.be.ok;
    expect(this.requests[0].requestBody.get('backendUrl')).to.not.be.ok;
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 10}));
  });
  it('init with experiments, participation & manipulation', function (done) {
    Client.experiments = [manipulatedExperiment];
    PostStorage.init({}, () => {
      done();
    });
    expect(this.requests).to.have.length(1);
    expect(this.requests[0].requestBody.get('manipulated')).to.eq('1');
    expect(this.requests[0].requestBody.get('participates')).to.eq('1');
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 10}));
  });
  it('init with experiments and participation, but without manipulation', function (done) {
    Client.experiments = [onlyParticipatesExperiment];
    PostStorage.init({}, () => {
      done();
    });
    expect(this.requests).to.have.length(1);
    expect(this.requests[0].requestBody.get('manipulated')).to.eq('0');
    expect(this.requests[0].requestBody.get('participates')).to.eq('1');
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 10}));
  });
  it('init with experiments without participation', function (done) {
    Client.experiments = [notParticipatesExperiment];
    PostStorage.init({}, () => {
      done();
    });
    expect(this.requests).to.have.length(1);
    expect(this.requests[0].requestBody.get('manipulated')).to.eq('0');
    expect(this.requests[0].requestBody.get('participates')).to.eq('0');
    this.requests[0].respond(200, {'Content-Type': 'application/json'},
                             JSON.stringify({success: 1, json: 1, csrf_token: 10}));
  });
});