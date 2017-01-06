/**
 * Proudly created by ohad on 25/12/2016.
 */
let _                 = require('./../../../common/util/wrapper'),
    expect            = require('chai').expect,
    DomRemoveExecutor = require('./remove');

describe('DomRemoveExecutor', function () {
    let div, a;
    before(() => {
        div = document.createElement('div');
        div.setAttribute('id', 'div');
        document.querySelector('body').appendChild(div);
    });
    beforeEach(() => {
        a = document.createElement('a');
        div.appendChild(a);
    });
    afterEach(() => {
        _.forEach(div.children, (elem) => {elem.parentNode.removeChild(elem)});
    });
    after(() => {
        div.parentNode.removeChild(div);
    });
    it('Remove element', () => {
        DomRemoveExecutor.execute({targets: '#div a'});
        expect(a.parentNode).to.not.be.ok;
    });
    it('Preconditions', () => {
        expect(DomRemoveExecutor.preconditions({})).to.be.false;
        expect(DomRemoveExecutor.preconditions({targets: 'body'})).to.be.false;
        expect(DomRemoveExecutor.preconditions({targets: 'head'})).to.be.false;
        expect(DomRemoveExecutor.preconditions({targets: 'html'})).to.be.false;
        expect(DomRemoveExecutor.preconditions({targets: '#div a'})).to.be.true;
    })
});