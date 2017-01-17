/**
 * Proudly created by ohad on 19/12/2016.
 */
const expect        = require('chai').expect,
      BaseError     = require('../../../common/log/base.error'),
      StyleExecutor = require('./style'),
      _             = require('./../../../common/util/wrapper'),
      styles        = require('./testdata/style.scss').locals,
      custom        = require('./testdata/custom.scss').locals;

describe('StyleExecutor', function () {
    let ul, li1, li2, li3, li4;
    before(() => {
        ul = document.createElement('ul');
        ul.setAttribute('id', 'lost');
        document.querySelector('body').appendChild(ul);
        li1             = document.createElement('li');
        li1.textContent = 'Jack';
        li1.classList.add(styles.survivor);
        ul.appendChild(li1);
        li2             = document.createElement('li');
        li2.textContent = 'Kate';
        li2.classList.add(styles.survivor);
        ul.appendChild(li2);
        li3             = document.createElement('li');
        li3.textContent = 'Sawyer';
        li3.classList.add('conman');
        ul.appendChild(li3);
        li4             = document.createElement('li');
        li4.textContent = 'Charlie';
        li4.classList.add('deceased');
        ul.appendChild(li4);
    });
    beforeEach(() => {
        _.css.load(require('./testdata/style.scss'));
        document.querySelectorAll('li').forEach(function (li) {
            expect(getComputedStyle(li).padding).to.equal('10px');
        });
        document.querySelectorAll('.survivor').forEach(function (li) {
            expect(getComputedStyle(li).margin).to.equal('10px');
        });
    });
    afterEach(() => {
        // Clean all injected styles.
        document.querySelectorAll('style[' + _.css.identifyingAttribute + ']')
                .forEach(function (styleElement) {
                    styleElement.parentNode.removeChild(styleElement);
                });
    });
    after(() => {
        ul.parentNode.removeChild(ul);
    });
    it('Preconditions', () => {
        expect(() => {StyleExecutor.preconditions({css: 'a {}'})}).to.not.throw(Error);
        expect(() => {
            StyleExecutor.preconditions({css: require('./testdata/custom.scss')})
        }).to.not.throw(Error);
        expect(() => {StyleExecutor.preconditions({})}).to.throw(BaseError);
    });
    it('text', () => {
        const cssText = require('./testdata/custom.scss')[0][1];
        StyleExecutor.execute({css: cssText});
        document.querySelectorAll('li').forEach(function (li) {
            expect(getComputedStyle(li).paddingLeft).to.equal('20px');
        });
        document.querySelectorAll(`.${custom.survivor}`).forEach(function (li) {
            expect(getComputedStyle(li).marginLeft).to.equal('50px');
        });
    });
    it('text', () => {
        const css = require('./testdata/custom.scss');
        StyleExecutor.execute({css: css});
        document.querySelectorAll('li').forEach(function (li) {
            expect(getComputedStyle(li).paddingLeft).to.equal('20px');
        });
        document.querySelectorAll(`.${custom.survivor}`).forEach(function (li) {
            expect(getComputedStyle(li).marginLeft).to.equal('50px');
        });
    });
});
