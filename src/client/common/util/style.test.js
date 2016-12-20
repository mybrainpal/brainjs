/**
 * Proudly created by ohad on 15/12/2016.
 */
var chai      = require('chai'),
    expect    = require('chai').expect,
    rewire    = require('rewire'),
    StyleUtil = rewire('./style');

describe('StyleUtil', function () {
    var a1;
    before(function () {
        a1             = document.createElement('a');
        a1.textContent = 'plata o plomo'; // for testing and life
        a1.setAttribute('href', 'https://www.youtube.com/watch?v=HdCvg17P6FU&t=36');
        a1.setAttribute('id', 'a1');
        document.getElementsByTagName('body')[0].appendChild(a1);
    });
    it('Load cssText from import', function () {
        var styles = require('css!./testdata/style.css');
        a1.setAttribute('class', styles.locals.stark);
        StyleUtil.load(styles[0][1]);
        expect(window.getComputedStyle(a1).paddingLeft).to.equal('100px');
        expect(window.getComputedStyle(a1).paddingTop).to.equal('50px');
    });
    afterEach(function () {
        document.querySelectorAll('style[' + StyleUtil.identifyingAttribute + ']')
                .forEach(function (styleElement) {
                    styleElement.parentNode.removeChild(styleElement);
                });
        a1.setAttribute('class', '');
    });
    after(function () {
        a1.parentNode.removeChild(a1);
    });
});
