/**
 * Proudly created by ohad on 02/03/2017.
 */
const expect    = require('chai').expect,
      chai      = require('chai'),
      Datastore = require('@google-cloud/datastore'),
      App       = require('./app');

chai.use(require('chai-http'));

describe('Save Router', function () {
  this.timeout(1000);
  const kind = 'magic', body = {kind: kind, wizard: 'Harry Potter'};
  let datastore;
  before(() => {
    datastore = Datastore();
    expect(datastore).to.be.ok;
  });
  beforeEach((done) => {
    datastore.runQuery(datastore.createQuery(null, kind))
             .then((results) => {
               const keys = results[0].map((entity) => entity[Datastore.KEY]);
               datastore.delete(keys).then(() => {done()})
             });
  });
  afterEach((done) => {
    datastore.runQuery(datastore.createQuery(null, kind))
             .then((results) => {
               const keys = results[0].map((entity) => entity[Datastore.KEY]);
               datastore.delete(keys).then(() => {done()})
             });
  });
  it('environment variables', () => {
    expect(process.env.DATASTORE_EMULATOR_HOST).to.be.ok;
  });
  it('message saved', (done) => {
    chai.request(App)
        .post('/save')
        .send(body)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.type).to.equal('text/plain');
          expect(res.text).to.equal('');
          expect(res).to.have.header('Access-Control-Allow-Origin', '*');
          expect(res).to.have.header('Access-Control-Allow-Headers',
                                     'Origin, X-Requested-With, Content-Type, Accept');
          datastore.runQuery(datastore.createQuery(null, kind)
                                      .filter('wizard', '=', body.wizard))
                   .then((results) => {
                     expect(results[0].length).to.be.ok;
                     done();
                   });
        });
  });
  it('empty body', (done) => {
    chai.request(App)
        .post('/save')
        .end((err, res) => {
          expect(res).to.have.status(500);
          expect(res.type).to.equal('text/plain');
          expect(res.text).to.equal('');
          expect(res).to.have.header('Access-Control-Allow-Origin', '*');
          expect(res).to.have.header('Access-Control-Allow-Headers',
                                     'Origin, X-Requested-With, Content-Type, Accept');
          done();
        })
  });
});
