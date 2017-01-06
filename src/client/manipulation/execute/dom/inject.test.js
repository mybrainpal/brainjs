/**
 * Proudly created by ohad on 24/12/2016.
 */
let expect         = require('chai').expect,
    InjectExecutor = require('./inject');

describe('InjectExecutor', function () {
    let div, src, target, origText;
    before(() => {
        div = document.createElement('div');
        div.setAttribute('id', 'westworld');
        document.querySelector('body').appendChild(div);
        src             = document.createElement('p');
        src.textContent = 'Delores';
        src.classList.add('host');
        div.appendChild(src);
        target             = document.createElement('p');
        origText           = 'The man in black';
        target.textContent = origText;
        target.classList.add('human');
        div.appendChild(target);
    });
    beforeEach(() => {
        target.textContent = origText;
    });
    after(() => {
        div.parentNode.removeChild(div);
    });
    it('Inject from source', () => {
        InjectExecutor.execute({target: '#westworld>.human', sourceSelector: '#westworld>.host'});
        document.querySelectorAll('#westworld>.human').forEach(function (elem) {
            expect(elem.innerHTML).to.be.equal(src.innerHTML);
        });
    });
    it('Inject from html', () => {
        InjectExecutor.execute({target: '#westworld>.human', html: 'the maze'});
        expect(document.querySelector('#westworld>.human').innerHTML).to.be.equal('the maze');
    });
    it('append html', () => {
        const toAppend = 'looks for the maze';
        InjectExecutor.execute({target: '#westworld>.human', html: toAppend, append: true});
        expect(document.querySelector('#westworld>.human').innerHTML).to.be
                                                                     .equal(origText + toAppend);
    });
    it('Preconditions', () => {
        expect(InjectExecutor.preconditions({})).to.be.false;
        expect(InjectExecutor.preconditions({html: ''})).to.be.false;
        expect(
            InjectExecutor.preconditions({target: 'body', html: 1})).to.be.false;
        expect(InjectExecutor.preconditions({target: 'body', sourceSelector: 1})).to.be.false;
        expect(InjectExecutor.preconditions(
            {target: 'body', html: '', sourceSelector: ''})).to.be.false;
        expect(InjectExecutor.preconditions({target: 'body', sourceSelector: ''})).to.be.false;
        expect(InjectExecutor.preconditions({target: 'body', html: '', append: 1})).to.be.false;
        expect(InjectExecutor.preconditions({target: 'body', sourceSelector: 'body'})).to.be.true;
        expect(InjectExecutor.preconditions({target: 'body', html: ''})).to.be.true;
    })
});