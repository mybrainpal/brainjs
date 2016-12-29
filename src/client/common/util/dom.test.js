/**
 * Proudly created by ohad on 18/12/2016.
 */
let expect = require('chai').expect;
let text   = require('./dom').text;

describe('DomUtils', function () {
    describe('text', function () {
        let ul, li;
        before(function () {
            ul = document.createElement('ul');
            ul.setAttribute('id', 'heirs');
            document.querySelector('body').appendChild(ul);
            li = document.createElement('li');
            li.classList.add('khaleesi');
            li.textContent = 'Khaleesi';
            ul.appendChild(li);
            li = document.createElement('li');
            li.classList.add('stannis');
            li.textContent = 'Stannis';
            ul.appendChild(li);
        });
        after(function () {
            document.querySelector('body').removeChild(ul);
        });
        it('gets the text for selector', function () {
            expect(text('.khaleesi')).to.equal('Khaleesi');
        });
        it('gets the text for selector with children', function () {
            expect(text('#heirs')).to.equal('KhaleesiStannis');
        });
        it('gets the text for element', function () {
            expect(text(document.querySelector('.khaleesi'))).to.equal('Khaleesi');
        });
        it('should decode special chars', function () {
            li             = document.createElement('li');
            li.textContent = 'M\x26M';
            expect(text(li)).to.equal('M&M');
        });
    });
});
