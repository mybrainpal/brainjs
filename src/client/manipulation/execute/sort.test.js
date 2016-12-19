/**
 * Proudly created by ohad on 18/12/2016.
 */
var expect       = require('chai').expect,
    rewire       = require('rewire'),
    SortExecutor = rewire('./sort'),
    tinysort     = require('tinysort');

describe('SortExecutor', function () {
    var ul, li1, li2, li3;
    beforeEach(function () {
        ul = document.createElement('ul');
        ul.setAttribute('id', 'ul');
        document.querySelector('body').appendChild(ul);
        li2             = document.createElement('li');
        li2.textContent = '2';
        ul.appendChild(li2);
        li1             = document.createElement('li');
        li1.textContent = '1';
        ul.appendChild(li1);
        li3             = document.createElement('li');
        li3.textContent = '3';
        ul.appendChild(li3);
    });
    afterEach(function () {
        ul.parentNode.removeChild(ul);
    });
    it('Sort elements', function () {
        SortExecutor.execute(document.querySelectorAll('#ul>li'), {});
        expect(ul.children[0]).to.equal(li1);
        expect(ul.children[1]).to.equal(li2);
        expect(ul.children[2]).to.equal(li3);
    });
    it('Sort array of elements', function () {
        SortExecutor.execute([li2, li1, li3], {});
        expect(ul.children[0]).to.equal(li1);
        expect(ul.children[1]).to.equal(li2);
        expect(ul.children[2]).to.equal(li3);
    });
    it('don\'t sort a single element', function () {
        SortExecutor.execute(document.querySelectorAll('#ul:first-child'), {});
        expect(ul.children[0]).to.equal(li2);
        expect(ul.children[1]).to.equal(li1);
        expect(ul.children[2]).to.equal(li3);
        expect(ul.parentNode).to.equal(document.querySelector('body'));
    });
    it('don\'t sort zero elements', function () {
        SortExecutor.execute(document.querySelectorAll('#ul>a'), {});
        expect(ul.children[0]).to.equal(li2);
        expect(ul.children[1]).to.equal(li1);
        expect(ul.children[2]).to.equal(li3);
        expect(ul.parentNode).to.equal(document.querySelector('body'));
    });
    it('Preconditions', function () {
        SortExecutor.__set__({
                                 'tinysort': null
                             });
        expect(SortExecutor.preconditions([], {})).to.be.false;
        SortExecutor.__set__({
                                 'tinysort': tinysort
                             });
        expect(SortExecutor.preconditions([], {})).to.be.true;
    });
});