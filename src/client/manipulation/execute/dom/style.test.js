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
  let ul;
  before(() => {
    ul = _.ul({id: 'lost'},
              _.li({class: styles.survivor}, 'Jack'),
              _.li({class: styles.survivor}, 'Kate'),
              _.li({class: 'conman'}, 'Sawyer'),
              _.li({class: 'deceased'}, 'Charlie'));
    document.querySelector('body').appendChild(ul);
  });
  beforeEach(() => {
    _.load(require('./testdata/style.scss'));
    document.querySelectorAll('li').forEach(function (li) {
      expect(getComputedStyle(li).padding).to.equal('10px');
    });
    document.querySelectorAll('.survivor').forEach(function (li) {
      expect(getComputedStyle(li).margin).to.equal('10px');
    });
  });
  afterEach(() => {
    // Clean all injected styles.
    document.querySelectorAll('style[' + _.identifyingAttribute + ']')
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
