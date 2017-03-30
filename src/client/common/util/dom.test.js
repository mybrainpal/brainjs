/**
 * Proudly created by ohad on 18/12/2016.
 */
const expect = require('chai').expect,
      _      = require('lodash'),
      $      = require('./dom');

describe('DomUtils', function () {
  describe('event emitter', function () {
    this.timeout(100);
    let a, fired, fireFn = () => {fired = true}, index = 0;
    before(() => {
      a = document.createElement('a');
      a.setAttribute('id', 'one-hand');
      a.textContent = 'jamie';
      document.querySelector('body').appendChild(a);
    });
    beforeEach(() => {
      index++;
      fired = false;
    });
    after(() => {
      a.parentNode.removeChild(a);
    });
    it('regular event', (done) => {
      $.on(`click${index}`, fireFn, {}, a);
      $.trigger(`click${index}`, {}, a);
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('selector', (done) => {
      $.on(`click${index}`, fireFn, {}, '#one-hand');
      $.trigger(`click${index}`, {}, '#one-hand');
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('detail match', (done) => {
      $.on(`click${index}`, fireFn, {handCount: 1});
      $.trigger(`click${index}`, {handCount: 1});
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('id', (done) => {
      $.on(`click${index}`, fireFn, 1);
      $.trigger(`click${index}`, {id: 1});
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('id mismatch', (done) => {
      $.on(`click${index}`, fireFn, 2);
      $.trigger(`click${index}`, {id: 1});
      setTimeout(() => {
        expect(fired).to.be.false;
        done();
      });
    });
    it('remove listener', (done) => {
      $.off(`click${index}`, $.on(`click${index}`, fireFn));
      $.trigger(`click${index}`);
      setTimeout(() => {
        expect(fired).to.be.false;
        done();
      });
    });
    it('remove listener with id', (done) => {
      let newHandler = $.on(`click${index}`, fireFn, 1);
      $.off(`click${index}`, newHandler);
      $.trigger(`click${index}`);
      setTimeout(() => {
        expect(fired).to.be.false;
        done();
      });
    });
    it('this context', (done) => {
      const a = [1];
      a.fn    = function () {
        if (this[0] === 1) {
          done();
        } else {
          done('this is shit!');
        }
      };
      $.on.call(a, 'flip-flops', a.fn);
      $.trigger('flip-flops');
    })
  });
  describe('visibility', function () {
    let div, visible, notVisible, inViewport, leftOfViewport, rightOfViewport, aboveViewport,
        belowViewport, notDisplayed, zeroOpacity, zIndex1, zIndex2, centerAbove, centerBelow,
        centerLeft, centerRight;
    before(() => {
      div = $.div();
      document.querySelector('body').appendChild(div);
      div.appendChild(visible = document.createElement('div'));
      visible.style       = 'border: 1px solid black; margin: 5px; display: inline-block;';
      visible.textContent = 'visible';
      div.appendChild(inViewport = visible.cloneNode(false));
      inViewport.textContent = 'inViewport';
      div.appendChild(notDisplayed = visible.cloneNode(false));
      notDisplayed.style.display = 'none';
      notDisplayed.textContent   = 'notDisplayed';
      div.appendChild(notVisible = visible.cloneNode(false));
      notVisible.style.visibility = 'hidden';
      notVisible.textContent      = 'notVisible';
      div.appendChild(leftOfViewport = visible.cloneNode(false));
      leftOfViewport.style.position = 'absolute';
      leftOfViewport.style.right    = '100000px';
      leftOfViewport.textContent    = 'leftOfViewport';
      div.appendChild(rightOfViewport = leftOfViewport.cloneNode(false));
      rightOfViewport.style.right = '0';
      rightOfViewport.style.left  = '100000px';
      rightOfViewport.textContent = 'rightOfViewport';
      div.appendChild(aboveViewport = leftOfViewport.cloneNode(false));
      aboveViewport.style.right  = '0';
      aboveViewport.style.bottom = '100000px';
      aboveViewport.textContent  = 'aboveViewport';
      div.appendChild(belowViewport = leftOfViewport.cloneNode(false));
      belowViewport.style.right = '0';
      belowViewport.style.top   = '100000px';
      belowViewport.textContent = 'belowViewport';
      div.appendChild(centerAbove = leftOfViewport.cloneNode(false));
      centerAbove.style.top    = '-200px';
      centerAbove.style.left   = '0px';
      centerAbove.style.height = centerAbove.style.width = '200px';
      centerAbove.textContent       = '';
      centerAbove.style.borderColor = '#0c0';
      div.appendChild(centerBelow = centerAbove.cloneNode(false));
      centerBelow.style.top         = '';
      centerBelow.style.bottom      = '-200px';
      centerBelow.style.borderColor = '#c00';
      div.appendChild(centerLeft = centerAbove.cloneNode(false));
      centerLeft.style.top         = '0px';
      centerLeft.style.left        = '-200px';
      centerLeft.style.borderColor = '#00f';
      div.appendChild(centerRight = centerAbove.cloneNode(false));
      centerRight.style.top         = '0px';
      centerRight.style.left        = '';
      centerRight.style.right       = '-200px';
      centerRight.style.borderColor = '#cc0';
      div.appendChild(zeroOpacity = visible.cloneNode(false));
      zeroOpacity.textContent   = 'zeroOpacity';
      zeroOpacity.style.opacity = '0';
      div.appendChild(zIndex1 = visible.cloneNode(false));
      zIndex1.textContent    = 'zIndex1';
      zIndex1.style.position = 'absolute';
      zIndex1.style.left     =
        zIndex1.style.top = zIndex1.style.width = zIndex1.style.height = '100px';
      zIndex1.style.zIndex = '1';
      div.appendChild(zIndex2 = zIndex1.cloneNode(false));
      zIndex2.textContent = 'zIndex2';
      zIndex2.style.left  = zIndex2.style.top = '90px';
      zIndex2.style.width = zIndex2.style.height = '120px';
      zIndex2.style.backgroundColor = 'red';
      zIndex2.style.zIndex          = '2';
    });
    after(() => {
      // div.parentNode.removeChild(div);
    });
    it('isVisible = true', () => {
      expect($.isVisible(div)).to.be.true;
      expect($.isVisible(visible)).to.be.true;
      expect($.isVisible(inViewport)).to.be.true;
      expect($.isVisible(zIndex2)).to.be.true;
      expect($.isVisible(centerAbove)).to.be.true;
      expect($.isVisible(centerBelow)).to.be.true;
      expect($.isVisible(centerLeft)).to.be.true;
      expect($.isVisible(centerRight)).to.be.true;
    });
    it('isVisible = false', () => {
      expect($.isVisible(notDisplayed)).to.be.false;
      expect($.isVisible(notVisible)).to.be.false;
      expect($.isVisible(document.createElement('div'))).to.be.false;
      expect($.isVisible(zIndex1)).to.be.false;
      expect($.isVisible(zeroOpacity)).to.be.false;
      expect($.isVisible(leftOfViewport)).to.be.false;
      expect($.isVisible(rightOfViewport)).to.be.false;
      expect($.isVisible(aboveViewport)).to.be.false;
      expect($.isVisible(belowViewport)).to.be.false;
    });
  });
  describe('style', function () {
    const css      = require('./testdata/style.css'),
          localCss = require('./testdata/style.local.css'),
          scss     = require('./testdata/test.scss');
    let a1;
    before(() => {
      a1             = document.createElement('a');
      a1.textContent = 'plata o plomo'; // for testing and life
      a1.setAttribute('href', 'https://www.youtube.com/watch?v=HdCvg17P6FU&t=36');
      a1.setAttribute('id', 'a1');
      document.getElementsByTagName('body')[0].appendChild(a1);
    });
    it('Input is verified', () => {
      expect(() => {$.load(1)}).to.throw(Error);
    });
    it('loadable', () => {
      expect($.loadable(1)).to.be.false;
      const invalid = _.cloneDeep(css).push([]);
      expect($.loadable(invalid)).to.be.false;
      expect($.loadable('')).to.be.true;
      expect($.loadable(css)).to.be.true;
    });
    it('Load css from import', () => {
      a1.setAttribute('class', 'stark');
      $.load(css);
      expect(getComputedStyle(a1).paddingLeft).to.equal('100px');
      expect(getComputedStyle(a1).paddingTop).to.equal('50px');
    });
    it('Load local css from import', () => {
      a1.setAttribute('class', 'lannister');
      $.load(localCss);
      expect(getComputedStyle(a1).paddingBottom).to.equal('0px');
      a1.setAttribute('class', localCss.locals.lannister);
      expect(getComputedStyle(a1).paddingBottom).to.equal('40px');
    });
    it('Load scss from import', () => {
      a1.setAttribute('class', scss.locals.test);
      $.load(scss);
      expect(getComputedStyle(a1).marginRight).to.equal('10px');
    });
    it('Load text', () => {
      $.load('a {margin-left: 10px}');
      expect(getComputedStyle(a1).marginLeft).to.equal('10px');
    });
    it('set style', () => {
      expect(() => {$.style($.a(), {'eye-lashes': '2cm'})}).to.throw(Error);
      const a = $.a();
      $.style(a, {width: '100px'});
      expect(a.style.width).to.eq('100px');
      $.style(a, {width: null});
      //noinspection JSUnresolvedVariable
      expect(a.style.width).to.not.be.ok;
    });
    afterEach(() => {
      document.querySelectorAll('style[' + $.identifyingAttribute + ']')
              .forEach((styleElement) => {
                styleElement.parentNode.removeChild(styleElement);
              });
      a1.setAttribute('class', '');
    });
    after(() => {
      a1.parentNode.removeChild(a1);
    });
  });
  describe('elements', function () {
    it('make element errors', () => {
      expect(() => {$.create(1)}).to.throw(Error);
      expect(() => {$.a({class: 1})}).to.throw(Error);
      expect(() => {$.a({class: ['a', 1]})}).to.throw(Error);
      expect(() => {$.a({awesomeness: 'too bad im not in MDN spec!'})}).to.throw(Error);
      expect(() => {$.a({style: {swag: 'bruno-mars'}})}).to.throw(Error);
    });
    it('make element', () => {
      let a = $.create('a');
      expect(a).to.be.instanceOf(HTMLAnchorElement);
      a = $.a('hola');
      expect(a).to.be.instanceOf(HTMLAnchorElement);
      expect(a.textContent).to.eq('hola');
      let div = $.div({id: 'playlist'},
                      $.a({
                            class: 'eden',
                            href : 'https://www.youtube.com/watch?v=nwpLIXdrHS0'
                          }),
                      $.a({
                            href: 'https://www.youtube.com/watch?v=Ck_YXl_nC2s'
                          }, 'tarefet'));
      expect(div).to.be.instanceOf(HTMLDivElement);
      expect(div.id).to.eq('playlist');
      expect(div.children).to.have.length(2);
      expect(div.children[0]).to.be.instanceOf(HTMLAnchorElement);
      expect(div.children[1]).to.be.instanceOf(HTMLAnchorElement);
      expect(div.children[0].classList.contains('eden')).to.be.true;
      expect(div.children[0].getAttribute('href')).to.eq(
        'https://www.youtube.com/watch?v=nwpLIXdrHS0');
      expect(div.children[1].textContent).to.eq('tarefet');
      expect(div.children[1].href).to.eq(
        'https://www.youtube.com/watch?v=Ck_YXl_nC2s');
      a = $.create('a', {
        onclick: () => {}, dataset: {a: 1}, 'data-b': 2, style: {color: 'rgb(0,0,0)'},
        class  : ['a', 'b']
      });
      expect(_.isFunction(a.onclick)).to.be.true;
      expect(a.getAttribute('data-a')).to.eq('1');
      expect(a.getAttribute('data-b')).to.eq('2');
      expect(a.style.color).to.eq('rgb(0, 0, 0)');
      expect(a.classList.contains('a')).to.be.true;
      expect(a.classList.contains('b')).to.be.true;
    });
    it('element types', () => {
      expect($.a()).to.be.instanceOf(HTMLAnchorElement);
      expect($.div()).to.be.instanceOf(HTMLDivElement);
      expect($.img()).to.be.instanceOf(HTMLImageElement);
      expect($.p()).to.be.instanceOf(HTMLParagraphElement);
      expect($.span()).to.be.instanceOf(HTMLSpanElement);
      expect($.ul()).to.be.instanceOf(HTMLUListElement);
      expect($.li()).to.be.instanceOf(HTMLLIElement);
    });
  });
});
