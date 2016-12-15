/**
 * Proudly created by ohad on 15/12/2016.
 */
var chai      = require('chai'),
    expect    = require('chai').expect,
    rewire    = require('rewire'),
    StyleUtil = rewire('./style');

describe('StyleUtil', function () {
    var a1, styleElement;
    before(function () {
        a1             = document.createElement('a');
        a1.textContent = 'PLATA O POBRE'; // for testing
        a1.setAttribute('id', 'a1');
        document.getElementsByTagName('body')[0].appendChild(a1);
    });
    it('Initialization', function () {
        expect(StyleUtil.__get__('_styleSheet') instanceof CSSStyleSheet).to.be.true;
    });
    it('Insert rule', function () {
        StyleUtil.insertRule('#a1', '{margin-top: 200px;}');
        expect(window.getComputedStyle(a1).marginTop).to.equal('200px');
    });
    it('Insert rule with index', function () {
        StyleUtil.insertRule('#a1', '{margin-top: 200px;}');
        StyleUtil.insertRule('#a1', '{margin-top: 100px;}', 1);
        expect(window.getComputedStyle(a1).marginTop).to.equal('100px');
    });
    it('Insert rule without brackets', function () {
        StyleUtil.insertRule('#a1', 'margin-top: 200px');
        expect(window.getComputedStyle(a1).marginTop).to.equal('200px');
    });
    it('Load cssText from import', function () {
        var styles = require('css!./testdata/style.css');
        a1.setAttribute('class', styles.locals.stark);
        styleElement = StyleUtil.load(styles[0][1]);
        expect(window.getComputedStyle(a1).paddingLeft).to.equal('100px');
        expect(window.getComputedStyle(a1).paddingTop).to.equal('50px');
    });
    afterEach(function () {
        // Removes all rules from _styleSheet.
        if (StyleUtil.__get__('_styleSheet') instanceof CSSStyleSheet) {
            while (StyleUtil.__get__('_styleSheet').cssRules.length) {
                StyleUtil.__get__('_styleSheet').deleteRule(0);
            }
        }
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }
        a1.setAttribute('class', '');
    });
    after(function () {
        a1.parentNode.removeChild(a1);
    });
});
