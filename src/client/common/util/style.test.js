/**
 * Proudly created by ohad on 15/12/2016.
 */
const _         = require('lodash'),
      chai      = require('chai'),
      expect    = require('chai').expect,
      StyleUtil = require('./style'),
      css       = require('./testdata/style.css'),
      localCss  = require('./testdata/style.local.css'),
      scss      = require('./testdata/test.scss');

describe('StyleUtil', function () {
  let a1;
  before(() => {
    a1             = document.createElement('a');
    a1.textContent = 'plata o plomo'; // for testing and life
    a1.setAttribute('href', 'https://www.youtube.com/watch?v=HdCvg17P6FU&t=36');
    a1.setAttribute('id', 'a1');
    document.getElementsByTagName('body')[0].appendChild(a1);
  });
  it('Input is verified', () => {
    expect(() => {StyleUtil.load(1)}).to.throw(Error);
  });
  it('loadable', () => {
    expect(StyleUtil.loadable(1)).to.be.false;
    const invalid = _.cloneDeep(css).push([]);
    expect(StyleUtil.loadable(invalid)).to.be.false;
    expect(StyleUtil.loadable('')).to.be.true;
    expect(StyleUtil.loadable(css)).to.be.true;
  });
  it('Load css from import', () => {
    a1.setAttribute('class', 'stark');
    StyleUtil.load(css);
    expect(getComputedStyle(a1).paddingLeft).to.equal('100px');
    expect(getComputedStyle(a1).paddingTop).to.equal('50px');
  });
  it('Load local css from import', () => {
    a1.setAttribute('class', 'lannister');
    StyleUtil.load(localCss);
    expect(getComputedStyle(a1).paddingBottom).to.equal('0px');
    a1.setAttribute('class', localCss.locals.lannister);
    expect(getComputedStyle(a1).paddingBottom).to.equal('40px');
  });
  it('Load scss from import', () => {
    a1.setAttribute('class', scss.locals.test);
    StyleUtil.load(scss);
    expect(getComputedStyle(a1).marginRight).to.equal('10px');
  });
  it('Load text', () => {
    StyleUtil.load('a {margin-left: 10px}');
    expect(getComputedStyle(a1).marginLeft).to.equal('10px');
  });
  afterEach(() => {
    document.querySelectorAll('style[' + StyleUtil.identifyingAttribute + ']')
            .forEach((styleElement) => {
              styleElement.parentNode.removeChild(styleElement);
            });
    a1.setAttribute('class', '');
  });
  after(() => {
    a1.parentNode.removeChild(a1);
  });
});
