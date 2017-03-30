/**
 * Proudly created by ohad on 27/03/2017.
 */
const expect = require('chai').expect,
      sinon  = require('sinon'),
      _      = require('./wrapper'),
      $      = require('./dom');

describe('HttpUtil', function () {
  // Avoid arrow function to maintain `this` context.
  describe('Ajax', function () {
    this.timeout(100);
    const url = 'http://tu-casa.mi.casa';
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
    // POST request
    it('post request', function (done) {
      _.http.ajax(url, {}, (err, res) => {
        if (err) done(err);
        expect(res.json).to.be.ok;
        expect(res.success).to.be.ok;
        done();
      });
      expect(this.requests[0].withCredentials).to.be.true;
      expect(this.requests[0].method).to.eq('POST');
      expect(this.requests[0].async).to.be.true;
      expect(this.requests[0].url).to.eq(url);
      expect(this.requests[0].requestBody.get('submit')).to.be.ok;
      expect(this.requests[0].requestBody.get('ajax')).to.be.ok;
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1, json: 1}));
    });
    it('post tokens', function (done) {
      _.http.ajax(url, {}, (err, res) => {
        if (err) done(err);
        expect(res.csrf_token).to.eq(10);
        expect(_.http.csrf_token).to.eq('10');
        _.http.ajax(url, {}, (err, res) => {
          if (err) done(err);
          expect(res.csrf_token).to.eq(20);
          expect(_.http.csrf_token).to.eq('20');
          _.http.ajax(url, {}, (err) => {
            if (err) done(err);
            done();
          });
          expect(this.requests[2].requestBody.get('token')).to.eq('20');
          this.requests[2].respond(200, {'Content-Type': 'application/json'},
                                   JSON.stringify({success: 1, json: 1}));
        });
        expect(this.requests[1].requestBody.get('token')).to.eq('10');
        this.requests[1].respond(200, {'Content-Type': 'application/json'},
                                 JSON.stringify({success: 1, json: 1, csrf_token: 20}));
      });
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1, json: 1, csrf_token: 10}));
    });
    it('post send json params', function (done) {
      _.http.ajax(url, {amigo: 'mejor', hermano: false}, (err) => {
        if (err) done(err);
        done();
      });
      expect(this.requests[0].requestBody.get('hermano')).to.eq('false');
      expect(this.requests[0].requestBody.get('amigo')).to.eq('mejor');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1}));
    });
    it('post send string params', function (done) {
      _.http.ajax(url, `?chica=bonita&${encodeURIComponent('hombre ?')}=${encodeURIComponent(
        'http://pablo.escobar')}`, (err) => {
        if (err) done(err);
        done();
      });
      expect(this.requests[0].requestBody.get('chica')).to.eq('bonita');
      expect(this.requests[0].requestBody.get('hombre ?')).to.eq('http://pablo.escobar');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1}));
    });
    it('post send FormData', function (done) {
      let formData = new FormData();
      formData.set('viva', 'la-vida');
      _.http.ajax(url, formData, (err) => {
        if (err) done(err);
        done();
      });
      expect(this.requests[0].requestBody.get('viva')).to.eq('la-vida');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1}));
    });
    // GET request
    it('get request', function (done) {
      _.http.ajax(url, {}, (err, res) => {
        if (err) done(err);
        expect(res.json).to.be.ok;
        expect(res.success).to.be.ok;
        done();
      }, 'GET');
      expect(this.requests[0].withCredentials).to.be.true;
      expect(this.requests[0].method).to.eq('GET');
      expect(this.requests[0].async).to.be.true;
      expect(this.requests[0].url.startsWith(url)).to.be.true;
      expect(_.http.getQueryParam(this.requests[0].url, 'ajax')).to.be.ok;
      expect(_.http.getQueryParam(this.requests[0].url, 'submit')).to.be.ok;
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1, json: 1}));
    });
    it('get tokens', function (done) {
      _.http.ajax(url, {}, (err, res) => {
        if (err) done(err);
        expect(res.csrf_token).to.eq(10);
        expect(_.http.csrf_token).to.eq('10');
        _.http.ajax(url, {}, (err, res) => {
          if (err) done(err);
          expect(res.csrf_token).to.eq(20);
          expect(_.http.csrf_token).to.eq('20');
          _.http.ajax(url, {}, (err) => {
            if (err) done(err);
            done();
          }, 'GET');
          expect(_.http.getQueryParam(this.requests[2].url, 'token')).to.eq('20');
          this.requests[2].respond(200, {'Content-Type': 'application/json'},
                                   JSON.stringify({success: 1, json: 1}));
        }, 'GET');
        expect(_.http.getQueryParam(this.requests[1].url, 'token')).to.eq('10');
        this.requests[1].respond(200, {'Content-Type': 'application/json'},
                                 JSON.stringify({success: 1, json: 1, csrf_token: 20}));
      }, 'GET');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1, json: 1, csrf_token: 10}));
    });
    it('get send json params', function (done) {
      _.http.ajax(url, {amigo: 'mejor', hermano: false}, (err) => {
        if (err) done(err);
        done();
      }, 'GET');
      expect(_.http.getQueryParam(this.requests[0].url, 'hermano')).to.eq('false');
      expect(_.http.getQueryParam(this.requests[0].url, 'amigo')).to.eq('mejor');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1}));
    });
    it('get send string params', function (done) {
      _.http.ajax(url,
                  `?chica=bonita&${encodeURIComponent('hombre ?')}=${encodeURIComponent(
                    'http://pablo.escobar')}`, (err) => {
          if (err) done(err);
          done();
        }, 'GET');
      expect(_.http.getQueryParam(this.requests[0].url, 'chica')).to.eq('bonita');
      expect(_.http.getQueryParam(this.requests[0].url, 'hombre ?')).to.eq('http://pablo.escobar');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1}));
    });
    it('get send FormData', function (done) {
      let formData = new FormData();
      formData.set('viva', 'la-vida');
      _.http.ajax(url, formData, (err) => {
        if (err) done(err);
        done();
      }, 'GET');
      expect(_.http.getQueryParam(this.requests[0].url, 'viva')).to.eq('la-vida');
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1}));
    });
    // Response handling
    it('receive json params', function (done) {
      _.http.ajax(url, {}, (err, res) => {
        if (err) done(err);
        expect(res['?']).to.eq(';');
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({success: 1, json: 1, '?': ';'}));
    });
    it('receive json params, missing json flag', function (done) {
      let jsonData = {success: 1};
      _.http.ajax(url, {}, (err, res) => {
        if (err) done(err);
        expect(res).to.eq(JSON.stringify(jsonData));
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'application/json'}, JSON.stringify(jsonData));
    });
    it('receive json params, missing json header', function (done) {
      _.http.ajax(url, {}, (err) => {
        expect(err).to.be.ok;
        if (err) done();
        done('did you just hacked me?');
      });
      this.requests[0].respond(200, {}, JSON.stringify({success: 1, json: 1}));
    });
    it('missing success flag', function (done) {
      _.http.ajax(url, {}, (err) => {
        expect(err).to.be.ok;
        done();
      });
      this.requests[0].respond(200, {'Content-Type': 'application/json'},
                               JSON.stringify({json: 1}));
    });
    it('error status', function (done) {
      _.http.ajax(url, {}, (err) => {
        expect(err).to.be.ok;
        done();
      });
      this.requests[0].respond(500, {'Content-Type': 'application/json'},
                               JSON.stringify({json: 1}));
    });
    // Misc errors
    it('unknown type', function () {
      expect(() => {_.http.ajax('', '', null, 1)}).to.throw(Error);
    });
  });
  it('string key from query string', () => {
    let query = 'http://www.example.com?a=1';
    expect(_.http.getQueryParam(query, 'a')).to.eq('1');
    query = 'http://www.example.com?a=1&b=2';
    expect(_.http.getQueryParam(query, 'a')).to.eq('1');
    expect(_.http.getQueryParam(query, 'b')).to.eq('2');
    query = '?a=1';
    expect(_.http.getQueryParam(query, 'a')).to.eq('1');
    query = '&a=1';
    expect(_.http.getQueryParam(query, 'a')).to.eq('1');
    query = '?a=0';
    expect(_.http.getQueryParam(query, 'a')).to.eq('0');
    query = `?${encodeURIComponent(' ')}=0`;
    expect(_.http.getQueryParam(query, ' ')).to.eq('0');
    query = 'www.example/a=1';
    expect(_.http.getQueryParam(query, 'a')).to.not.be.ok;
    query = '?a=' + encodeURIComponent('http://www.google.com');
    expect(_.http.getQueryParam(query, 'a')).to.eq('http://www.google.com');
  });
  it('integer (index) key from query string', () => {
    expect(() => {_.http.getQueryParam('', -1)}).to.throw(Error);
    expect(() => {_.http.getQueryParam('', 1.5)}).to.throw(Error);
    expect(() => {_.http.getQueryParam('', {})}).to.throw(Error);
    let query = 'http://www.example.com?a=1';
    expect(_.http.getQueryParam(query, 0)).to.deep.equal({key: 'a', value: '1'});
    expect(_.http.getQueryParam(query, 1)).to.not.be.ok;
    query = 'http://www.example.com?a=1&b=2';
    expect(_.http.getQueryParam(query, 0)).to.deep.equal({key: 'a', value: '1'});
    expect(_.http.getQueryParam(query, 1)).to.deep.equal({key: 'b', value: '2'});
    query = '?a=1';
    expect(_.http.getQueryParam(query, 0)).to.deep.equal({key: 'a', value: '1'});
    query = '&a=1';
    expect(_.http.getQueryParam(query, 0)).to.deep.equal({key: 'a', value: '1'});
    query = 'www.example/a=1';
    expect(_.http.getQueryParam(query, 0)).to.not.be.ok;
    query = '?a=' + encodeURIComponent('http://www.google.com');
    expect(_.http.getQueryParam(query, 0)).to.deep
                                          .equal({key: 'a', value: 'http://www.google.com'});
  });
  it('update parameter in query string', () => {
    let query = 'http://www.example.com?a=';
    expect(_.http.setQueryParam(query + 1, 'a', 2)).to.eq(query + 2);
    query = 'example.com?a=1&b=2';
    expect(_.http.setQueryParam(query, 'a', 2)).to.eq('example.com?a=2&b=2');
    query = '?a=1&b=2';
    expect(query = _.http.setQueryParam(query, 'a', 2)).to.eq('?a=2&b=2');
    expect(_.http.setQueryParam(query, 'b', 3)).to.eq('?a=2&b=3');
    query = '?a=1';
    expect(_.http.setQueryParam(query, 'a', 2)).to.eq('?a=2');
    query = '&a=1';
    expect(_.http.setQueryParam(query, 'a', 2)).to.eq('&a=2');
    query = '';
    expect(_.http.setQueryParam(query, 'a', 1)).to.eq('?a=1');
    query = 'example.com';
    expect(query = _.http.setQueryParam(query, 'a', 1)).to.eq('example.com?a=1');
    expect(_.http.setQueryParam(query, 'b', 1)).to.eq('example.com?a=1&b=1');
    query = '?a=0';
    expect(_.http.setQueryParam(query, 'b', 1)).to.eq('?a=0&b=1');
    query = 'www.example/a=1';
    expect(_.http.setQueryParam(query, 'a', 1)).to.eq('www.example/a=1?a=1');
    query = '?a=' + encodeURIComponent('http://www.google.com');
    expect(_.http.setQueryParam(query, 'a', 1)).to.eq('?a=1');
    query = '?a=1';
    expect(_.http.setQueryParam(query, 'a', '&b=2&c=3')).to
                                                        .eq('?a=' + encodeURIComponent('&b=2&c=3'));
  });
  it('json to form data', () => {
    //noinspection JSCheckFunctionSignatures
    deepEqualFormData(_.http.toFormData(), new FormData());
    deepEqualFormData(_.http.toFormData(null), new FormData());
    deepEqualFormData(_.http.toFormData({}), new FormData());
    let fd = new FormData();
    fd.append('a', 1);
    deepEqualFormData(_.http.toFormData({a: 1}), fd);
    fd = new FormData();
    fd.append('a.b', 1);
    deepEqualFormData(_.http.toFormData({a: {b: 1}}), fd);
    fd = new FormData();
    fd.append('a.0', 1);
    deepEqualFormData(_.http.toFormData({a: [1]}), fd);
  });
  it('query string to form data', () => {
    //noinspection JSCheckFunctionSignatures
    deepEqualFormData(_.http.toFormData(''), new FormData());
    let fd = new FormData();
    fd.append('a', 1);
    deepEqualFormData(_.http.toFormData('?a=1'), fd);
    fd = new FormData();
    fd.append('a.b', '?');
    deepEqualFormData(
      _.http.toFormData('?' + encodeURIComponent('a.b') + '=' + encodeURIComponent('?')), fd);
    fd = new FormData();
    fd.append('a', 1);
    fd.append('b', 2);
    deepEqualFormData(_.http.toFormData('?a=1&b=2'), fd);
  });
});

function deepEqualFormData(fd1, fd2) {
  const keys1 = fd1.keys();
  const keys2 = fd2.keys();
  expect(keys1).to.deep.equal(keys2);
  for (let k1 of keys1) {
    expect(fd1.getAll(k1)).to.deep.equal(fd2.getAll(k1));
  }
}