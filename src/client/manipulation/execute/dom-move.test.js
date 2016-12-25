/**
 * Proudly created by ohad on 25/12/2016.
 */
var _               = require('./../../common/util/wrapper'),
    expect          = require('chai').expect,
    DomMoveExecutor = require('./dom-move');

describe('DomMoveExecutor', function () {
    var div, p1, p2, a, span;
    before(function () {
        div = document.createElement('div');
        div.setAttribute('id', 'div');
        document.querySelector('body').appendChild(div);
        p1 = document.createElement('p');
        p1.classList.add('first');
        span = document.createElement('span');
        p1.appendChild(span);
        div.appendChild(p1);
        p2 = document.createElement('p');
        div.appendChild(p2);
    });
    beforeEach(function () {
        a = document.createElement('a');
        p2.appendChild(a);
    });
    afterEach(function () {
        if (_.isElement(a.parentNode)) {
            a.parentNode.removeChild(a);
        }
    });
    after(function () {
        div.parentNode.removeChild(div);
    });
    it('move based on parent', function () {
        DomMoveExecutor.execute([a], {parentSelector: '#div>.first'});
        expect(a.parentNode).to.be.equal(p1);
        expect(a.previousSibling).to.be.equal(span);
    });
    it('move based on sibling', function () {
        DomMoveExecutor.execute([a], {nextSiblingSelector: '#div span'});
        expect(a.parentNode).to.be.equal(p1);
        expect(_.isElement(a.previousSibling)).to.not.be.ok;
    });
    it('do not move if parent is not changed', function () {
        DomMoveExecutor.execute([a], {parentSelector: '#div>p:nth-child(2)'});
        expect(a.parentNode).to.be.equal(p2);
    });
    it('do not move if next sibling is not changed', function () {
        a.parentNode.removeChild(a);
        p1.insertBefore(a, span);
        DomMoveExecutor.execute([a], {nextSiblingSelector: '#div span'});
        expect(a.parentNode).to.be.equal(p1);
        expect(_.isElement(a.previousSibling)).to.not.be.ok;
    });
    it('Preconditions', function () {
        expect(DomMoveExecutor.preconditions([], {})).to.be.false;
        expect(DomMoveExecutor.preconditions([a], {})).to.be.false;
        expect(DomMoveExecutor.preconditions([a], {
            parentSelector: 'effy', nextSiblingSelector: 'effy'
        })).to.be.false;
        expect(
            DomMoveExecutor.preconditions(document.querySelectorAll('body'),
                                          {parentSelector: 'div'})).to.be.false;
        expect(
            DomMoveExecutor.preconditions(document.querySelectorAll('head'),
                                          {parentSelector: 'div'})).to.be.false;
        expect(
            DomMoveExecutor.preconditions([document.documentElement],
                                          {parentSelector: 'div'})).to.be.false;
        expect(DomMoveExecutor.preconditions([a], {
            parentSelector: '#div>.first', nextSiblingSelector: '#div'
        })).to.be.false;
        expect(DomMoveExecutor.preconditions([a], {parentSelector: 'div'})).to.be.true;
        expect(DomMoveExecutor.preconditions([a], {
            parentSelector: 'div', nextSiblingSelector: 'effy'
        })).to.be.true;
    })
});