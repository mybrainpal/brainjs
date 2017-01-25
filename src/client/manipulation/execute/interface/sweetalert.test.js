/**
 * Proudly created by ohad on 23/12/2016.
 */
let _            = require('./../../../common/util/wrapper'),
    BaseError    = require('../../../common/log/base.error'),
    expect       = require('chai').expect,
    SwalExecutor = require('./sweetalert');

describe('SwalExecutor', function () {
  this.timeout(100);
  after(() => {
    const swal = document.querySelector('.swal2-container');
    swal.parentNode.removeChild(swal)
  });
  it('preconditions', () => {
    expect(() => {SwalExecutor.preconditions({swalFn: () => {}})}).to.not.throw(Error);
    expect(() => {SwalExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {SwalExecutor.preconditions({swalFn: 1})}).to.throw(BaseError);
  });
  it('modal fired', (done) => {
    const msg = `I can't make anything of this.`;
    SwalExecutor.execute({swalFn: (swal) => {swal({text: msg})}});
    setTimeout(() => {
      expect(document.querySelector('.swal2-container')).to.be.ok;
      expect(document.querySelector('.swal2-content').textContent).to.equal(msg);
      _.trigger('click', {}, document.querySelector('.swal2-container'));
      setTimeout(() => {
        expect(document.querySelector('.swal2-hide')).to.be.ok;
        done();
      }, 20);
    }, 10);
  });
});
