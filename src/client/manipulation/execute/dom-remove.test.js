/**
 * Proudly created by ohad on 25/12/2016.
 */
let expect            = require('chai').expect,
    DomRemoveExecutor = require('./dom-remove');

describe('DomRemoveExecutor', function () {
    let div, a;
    before(function () {
        div = document.createElement('div');
        div.setAttribute('id', 'div');
        document.querySelector('body').appendChild(div);
    });
    beforeEach(function () {
        a = document.createElement('a');
        div.appendChild(a);
    });
    after(function () {
        div.parentNode.removeChild(div);
    });
    it('Remove element', function () {
        DomRemoveExecutor.execute(document.querySelectorAll('#div>a'), {});
        expect(a.parentNode).to.not.be.ok;
    });
    it('Preconditions', function () {
        expect(DomRemoveExecutor.preconditions([], {})).to.be.false;
        expect(
            DomRemoveExecutor.preconditions(document.querySelectorAll('div'), {a: 1})).to.be.false;
        expect(
            DomRemoveExecutor.preconditions(document.querySelectorAll('body'), {})).to.be.false;
        expect(
            DomRemoveExecutor.preconditions(document.querySelectorAll('head'), {})).to.be.false;
        expect(
            DomRemoveExecutor.preconditions([document.documentElement], {})).to.be.false;
        expect(DomRemoveExecutor.preconditions([a], {})).to.be.true;
    })
});