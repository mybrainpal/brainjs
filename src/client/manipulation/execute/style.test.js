/**
 * Proudly created by ohad on 19/12/2016.
 */
var expect        = require('chai').expect,
    StyleExecutor = require('./style'),
    StyleUtil     = require('./../../common/util/style');

describe('StyleExecutor', function () {
    var ul, li1, li2, li3;
    before(function () {
        ul = document.createElement('ul');
        ul.setAttribute('id', 'lost');
        document.querySelector('body').appendChild(ul);
        li1             = document.createElement('li');
        li1.textContent = 'Jack';
        li1.classList.add('survivor');
        ul.appendChild(li1);
        li2             = document.createElement('li');
        li2.textContent = 'Kate';
        li1.classList.add('survivor');
        ul.appendChild(li2);
        li3             = document.createElement('li');
        li3.textContent = 'Sawyer';
        li1.classList.add('conman');
        ul.appendChild(li3);
    });
    beforeEach(function () {
        StyleUtil.load(require('css!./testdata/style.css')[0][1]);
        document.querySelectorAll('li').forEach(function (li) {
            expect(window.getComputedStyle(li).paddingLeft).to.equal('10px');
        });
        document.querySelectorAll('.survivor').forEach(function (li) {
            expect(window.getComputedStyle(li).marginTop).to.equal('30px');
        });
    });
    afterEach(function () {
        // Clean all injected styles.
        document.querySelectorAll('style[' + StyleUtil.identifyingAttribute + ']')
                .forEach(function (styleElement) {
                    styleElement.parentNode.removeChild(styleElement);
                });
    });
    after(function () {
        ul.parentNode.removeChild(ul);
    });
    it('Preconditions', function () {
        expect(StyleExecutor.preconditions([], {})).to.be.false;
    });
    it('Custom style', function () {
        var style = require('css!./testdata/custom.css');
        StyleExecutor.execute([], {
            cssText : style[0][1],
            selector: '.survivor'
        });
        document.querySelectorAll('li').forEach(function (li) {
            expect(window.getComputedStyle(li).paddingLeft).to.equal('20px');
        });
        document.querySelectorAll('.survivor').forEach(function (li) {
            expect(window.getComputedStyle(li).marginTop).to.equal('50px');
        });
        li1.focus();
        expect(window.getComputedStyle(li1).marginBottom).to.equal('10px');
    });
    it('Only affect provided elements', function () {
        var style = require('css!./testdata/custom.css');
        StyleExecutor.execute([li1], {
            cssText : style[0][1],
            selector: '.survivor'
        });
        expect(window.getComputedStyle(li1).paddingLeft).to.equal('20px');
        expect(window.getComputedStyle(li2).paddingLeft).to.equal('10px');
        expect(window.getComputedStyle(li1).marginTop).to.equal('50px');
        expect(window.getComputedStyle(li2).marginTop).to.equal('30px');
    });
    it('Responsive style', function () {
        var style = require('css!./testdata/responsive.css');
        StyleExecutor.execute([], {
            cssText : style[0][1],
            selector: '.survivor'
        });
        //noinspection JSValidateTypes
        document.innerWidth(400);
        document.querySelectorAll('li').forEach(function (li) {
            expect(window.getComputedStyle(li).paddingLeft).to.equal('0');
        });
        document.querySelectorAll('.survivor').forEach(function (li) {
            expect(window.getComputedStyle(li).marginTop).to.equal('20px');
        });
    });
});