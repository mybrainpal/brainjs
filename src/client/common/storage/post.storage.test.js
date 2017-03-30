/**
 * Proudly created by ohad on 29/03/2017.
 */
const expect      = require('chai').expect,
      sinon       = require('sinon'),
      Client      = require('../../common/client'),
      _           = require('../../common/util/wrapper'),
      PostStorage = require('./post.storage');

describe('PostStorage', function () {
  this.timeout(100);
  before(() => {
    Client.tracker = 'MC hammer';
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
  });
  it('client init', function (done) {
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
});