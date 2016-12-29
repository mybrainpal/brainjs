/**
 * Proudly created by ohad on 19/12/2016.
 */
const expect        = require('chai').expect,
      StyleExecutor = require('./style'),
      _             = require('./../../common/util/wrapper'),
      styles        = require('./testdata/style.css').locals,
      custom        = require('./testdata/custom.css').locals;

describe('StyleExecutor', function () {
    let ul, li1, li2, li3, li4;
    before(function () {
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
    beforeEach(function () {
        _.css.load(require('./testdata/style.css'));
        document.querySelectorAll('li').forEach(function (li) {
            expect(window.getComputedStyle(li).padding).to.equal('10px');
        });
        document.querySelectorAll('.survivor').forEach(function (li) {
            expect(window.getComputedStyle(li).margin).to.equal('10px');
        });
    });
    afterEach(function () {
        // Clean all injected styles.
        document.querySelectorAll('style[' + _.css.identifyingAttribute + ']')
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
        const cssText = require('./testdata/custom.css')[0][1];
        StyleExecutor.execute([], {
            cssText    : cssText,
            selector   : styles.survivor,
            customClass: custom['brainpal-custom']
        });
        document.querySelectorAll('li').forEach(function (li) {
            expect(window.getComputedStyle(li).paddingLeft).to.equal('20px');
        });
        document.querySelectorAll('.survivor').forEach(function (li) {
            expect(window.getComputedStyle(li).marginLeft).to.equal('50px');
        });
    });
    it('Only affect provided elements', function () {
        const cssText = require('./testdata/custom.css')[0][1];
        StyleExecutor.execute([li3], {
            cssText    : cssText,
            selector   : 'li',
            customClass: custom['brainpal-custom']
        });
        expect(window.getComputedStyle(li3).marginLeft).to.equal('50px');
        // li1 has .survivor class, and so should have margin-left: 10px.
        expect(window.getComputedStyle(li4).marginLeft).to.equal('0px');
    });
});
