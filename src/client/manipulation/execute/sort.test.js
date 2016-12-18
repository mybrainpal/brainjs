/**
 * Proudly created by ohad on 18/12/2016.
 */
var expect       = require('chai').expect,
    rewire       = require('rewire'),
    SortExecutor = rewire('./sort');

describe.only('SortExecutor', function () {
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
    it('Sort element list', function () {
        SortExecutor.execute(document.querySelectorAll('#ul>li'), {order: 'desc'});
        expect(ul.children[0]).to.equal(li3);
        expect(ul.children[1]).to.equal(li2);
        expect(ul.children[2]).to.equal(li1);
    });
    it('Sort by selector', function () {
        SortExecutor.execute('#ul>li', {order: 'desc'});
        expect(ul.children[0]).to.equal(li3);
        expect(ul.children[1]).to.equal(li2);
        expect(ul.children[2]).to.equal(li1);
    });
});