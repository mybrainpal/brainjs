/**
 * Proudly created by ohad on 24/12/2016.
 */
let expect         = require('chai').expect,
    InjectExecutor = require('./inject');

describe('InjectExecutor', function () {
    let div, src, target;
    before(function () {
        div = document.createElement('div');
        div.setAttribute('id', 'westworld');
        document.querySelector('body').appendChild(div);
        src             = document.createElement('p');
        src.textContent = 'Delores';
        src.classList.add('host');
        div.appendChild(src);
        target             = document.createElement('p');
        target.textContent = 'William';
        target.classList.add('human');
        div.appendChild(target);
        target             = target.cloneNode(true);
        target.textContent = 'The man in black';
        div.appendChild(target);
    });
    after(function () {
        div.parentNode.removeChild(div);
    });
    it('Inject from source', function () {
        InjectExecutor.execute(document.querySelectorAll('#westworld>.human'),
                               {sourceSelector: '#westworld>.host'});
        document.querySelectorAll('#westworld>.human').forEach(function (elem) {
            expect(elem.innerHTML).to.be.equal(src.innerHTML);
        });
    });
    it('Inject from html', function () {
        InjectExecutor.execute(document.querySelectorAll('#westworld>.human'), {html: 'the maze'});
        document.querySelectorAll('#westworld>.human').forEach(function (elem) {
            expect(elem.innerHTML).to.be.equal('the maze');
        });
    });
    it('Preconditions', function () {
        expect(InjectExecutor.preconditions([], {})).to.be.false;
        expect(InjectExecutor.preconditions([], {html: ''})).to.be.false;
        expect(
            InjectExecutor.preconditions(document.querySelectorAll('body'), {html: 1})).to.be.false;
        expect(InjectExecutor.preconditions(document.querySelectorAll('body'),
                                            {sourceSelector: 1})).to.be.false;
        expect(InjectExecutor.preconditions(document.querySelectorAll('body'),
                                            {html: '', sourceSelector: ''})).to.be.false;
        expect(InjectExecutor.preconditions(document.querySelectorAll('body'),
                                            {sourceSelector: ''})).to.be.false;
        expect(InjectExecutor.preconditions(document.querySelectorAll('body'),
                                            {sourceSelector: 'body'})).to.be.true;
        expect(
            InjectExecutor.preconditions(document.querySelectorAll('body'), {html: ''})).to.be.true;
    })
});