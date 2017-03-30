/**
 * Proudly created by ohad on 23/12/2016.
 */
let $            = require('./../../../common/util/dom'),
    BaseError    = require('../../../common/log/base.error'),
    expect       = require('chai').expect,
    SwalExecutor = require('./sweetalert');

describe('SwalExecutor', function () {
  this.timeout(1000);
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
      $.trigger('click', {}, '.swal2-container');
      setTimeout(() => {
        expect(document.querySelector('.swal2-hide')).to.be.ok;
        done();
      }, 20);
    }, 100);
  });
});
