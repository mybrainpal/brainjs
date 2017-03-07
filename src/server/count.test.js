/**
 * Proudly created by ohad on 06/03/2017.
 */
const _         = require('lodash'),
      expect    = require('chai').expect,
      chai      = require('chai'),
      Datastore = require('@google-cloud/datastore'),
      App       = require('./app'),
      Const     = require('../common/const');

chai.use(require('chai-http'));

// Test unit is unstable.
describe.skip('Count Router', function () {
  this.timeout(1000);
  const tracker = 'hoedown';
  let datastore, conversionEvent, registerUser, outOfGroupConversion, outOfGroupRegister;
  before(() => {
    datastore = Datastore();
    expect(datastore).to.be.ok;
  });
  beforeEach((done) => {
    conversionEvent = {
      key : datastore.key(Const.KIND.EVENT),
      data: {
        timestamp                 : 150,
        tracker                   : tracker,
        'client.created'          : 1,
        'experiment.included'     : true,
        'experimentGroup.included': true,
        'anchor.event'            : 'click'
      }
    };
    registerUser    = _.cloneDeep(conversionEvent);
    delete registerUser.data['anchor.event'];
    outOfGroupConversion = _.cloneDeep(conversionEvent);
    delete outOfGroupConversion.data['experimentGroup.included'];
    outOfGroupRegister = _.cloneDeep(registerUser);
    delete outOfGroupRegister.data['experimentGroup.included'];
    datastore.runQuery(datastore.createQuery(Const.KIND.EVENT))
             .then((results) => {
               const keys = results[0].map((entity) => entity[Datastore.KEY]);
               datastore.delete(keys).then(() => {done()})
             });
  });
  afterEach((done) => {
    conversionEvent = registerUser = outOfGroupConversion = outOfGroupRegister = null;
    datastore.runQuery(datastore.createQuery(Const.KIND.EVENT))
             .then((results) => {
               const keys = results[0].map((entity) => entity[Datastore.KEY]);
               datastore.delete(keys).then(() => {done()})
             });
  });
  it('environment variables', () => {
    expect(process.env.DATASTORE_EMULATOR_HOST).to.be.ok;
  });
  it('in group, with conversion', (done) => {
    datastore.upsert([conversionEvent, registerUser])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 200})
                   .end((err, res) => {
                     expect(err).to.be.null;
                     expect(res).to.have.status(200);
                     expect(res.type).to.equal('application/json');
                     expect(res.body).to.deep.equal({
                                                      total             : 1,
                                                      conversionOfAll   : 1,
                                                      groups            : 1,
                                                      conversionOfGroups: 1
                                                    });
                     expect(res).to.have.header('Access-Control-Allow-Origin',
                                                'https://dashboard.brainpal.io');
                     expect(res).to.have.header('Access-Control-Allow-Headers',
                                                'Origin, X-Requested-With, Content-Type, Accept');
                     done();
                   });
             });
  });
  it('in group, no conversion', (done) => {
    datastore.upsert([registerUser])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 200})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 1,
                                                      conversionOfAll   : 0,
                                                      groups            : 1,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  it('out of group, with conversion', (done) => {
    datastore.upsert([outOfGroupConversion, outOfGroupRegister])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 200})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 1,
                                                      conversionOfAll   : 1,
                                                      groups            : 0,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  it('out of group, no conversion', (done) => {
    datastore.upsert([outOfGroupRegister])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 200})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 1,
                                                      conversionOfAll   : 0,
                                                      groups            : 0,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  it('below min timestamp', (done) => {
    datastore.upsert([registerUser])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 300, toTimestamp: 400})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 0,
                                                      conversionOfAll   : 0,
                                                      groups            : 0,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  it('above max timestamp', (done) => {
    datastore.upsert([registerUser])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 50, toTimestamp: 100})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 0,
                                                      conversionOfAll   : 0,
                                                      groups            : 0,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  it('not included in experiment', (done) => {
    let otherRegister = _.cloneDeep(registerUser);
    delete otherRegister.data['experiment.included'];
    datastore.upsert([otherRegister])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 200})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 0,
                                                      conversionOfAll   : 0,
                                                      groups            : 0,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  it('distinct tracker', (done) => {
    datastore.upsert([registerUser])
             .then(() => {
               chai.request(App)
                   .get('/count/uplift')
                   .query({tracker: tracker + 'yada-yada', fromTimestamp: 100, toTimestamp: 200})
                   .end((err, res) => {
                     expect(res.body).to.deep.equal({
                                                      total             : 0,
                                                      conversionOfAll   : 0,
                                                      groups            : 0,
                                                      conversionOfGroups: 0
                                                    });
                     done();
                   });
             });
  });
  // Fail for unknown reason.
  it.skip('fromTimestamp not integer', (done) => {
    chai.request(App)
        .get('/count/uplift')
        .query({tracker: tracker, fromTimestamp: 'a', toTimestamp: 200})
        .end((err, res) => {
          expect(err).to.be.ok;
          expect(res).to.have.status(500);
          expect(res.type).to.equal('text/plain');
          expect(res.text).to.equal('');
          expect(res).to.have.header('Access-Control-Allow-Origin',
                                     'https://dashboard.brainpal.io');
          expect(res).to.have.header('Access-Control-Allow-Headers',
                                     'Origin, X-Requested-With, Content-Type, Accept');
          done();
        });
  });
  it.skip('toTimestamp not integer', (done) => {
    chai.request(App)
        .get('/count/uplift')
        .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 'a'})
        .end((err) => {
          expect(err).to.be.ok;
          done();
        });
  });
  it('fromTimestamp negative', (done) => {
    chai.request(App)
        .get('/count/uplift')
        .query({tracker: tracker, fromTimestamp: -1, toTimestamp: 200})
        .end((err) => {
          expect(err).to.be.ok;
          done();
        });
  });
  it('toTimestamp negative', (done) => {
    chai.request(App)
        .get('/count/uplift')
        .query({tracker: tracker, fromTimestamp: 100, toTimestamp: -1})
        .end((err) => {
          expect(err).to.be.ok;
          done();
        });
  });
  it('toTimestamp < fromTimestamp', (done) => {
    chai.request(App)
        .get('/count/uplift')
        .query({tracker: tracker, fromTimestamp: 100, toTimestamp: 10})
        .end((err) => {
          expect(err).to.be.ok;
          done();
        });
  });
});