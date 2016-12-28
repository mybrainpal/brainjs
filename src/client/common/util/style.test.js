/**
 * Proudly created by ohad on 15/12/2016.
 */
const chai      = require('chai'),
      expect    = require('chai').expect,
      StyleUtil = require('./style'),
      css       = require('./testdata/style.css'),
      scss      = require('./testdata/test.scss');

describe.only('StyleUtil', function () {
    let a1;
    before(() => {
        a1             = document.createElement('a');
        a1.textContent = 'plata o plomo'; // for testing and life
        a1.setAttribute('href', 'https://www.youtube.com/watch?v=HdCvg17P6FU&t=36');
        a1.setAttribute('id', 'a1');
        document.getElementsByTagName('body')[0].appendChild(a1);
    });
    it('Load css from import', () => {
        a1.setAttribute('class', css.locals.stark);
        StyleUtil.load(css[0][1]);
        expect(window.getComputedStyle(a1).paddingLeft).to.equal('100px');
        expect(window.getComputedStyle(a1).paddingTop).to.equal('50px');
    });
    it('Load scss from import', () => {
        a1.setAttribute('class', scss.locals.test);
        StyleUtil.load(scss[0][1]);
        expect(window.getComputedStyle(a1).marginRight).to.equal('10px');
    });
    it('Load text', () => {
        StyleUtil.load('a {margin-left: 10px}');
        expect(window.getComputedStyle(a1).marginLeft).to.equal('10px');
    });
    afterEach(() => {
        document.querySelectorAll('style[' + StyleUtil.identifyingAttribute + ']')
                .forEach(function (styleElement) {
                    styleElement.parentNode.removeChild(styleElement);
                });
        a1.setAttribute('class', '');
    });
    after(() => {
        a1.parentNode.removeChild(a1);
    });
});
