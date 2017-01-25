/**
 * Proudly created by ohad on 18/12/2016.
 */
const expect   = require('chai').expect,
      DomUtils = require('./dom');

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
      DomUtils.on(`click${index}`, fireFn, {}, a);
      DomUtils.trigger(`click${index}`, {}, a);
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('selector', (done) => {
      DomUtils.on(`click${index}`, fireFn, {}, '#one-hand');
      DomUtils.trigger(`click${index}`, {}, '#one-hand');
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('detail match', (done) => {
      DomUtils.on(`click${index}`, fireFn, {handCount: 1});
      DomUtils.trigger(`click${index}`, {handCount: 1});
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('id', (done) => {
      DomUtils.on(`click${index}`, fireFn, 1);
      DomUtils.trigger(`click${index}`, {id: 1});
      setTimeout(() => {
        expect(fired).to.be.true;
        done();
      });
    });
    it('id mismatch', (done) => {
      DomUtils.on(`click${index}`, fireFn, 2);
      DomUtils.trigger(`click${index}`, {id: 1});
      setTimeout(() => {
        expect(fired).to.be.false;
        done();
      });
    });
    it('remove listener', (done) => {
      DomUtils.on(`click${index}`, fireFn);
      DomUtils.off(`click${index}`, fireFn);
      DomUtils.trigger(`click${index}`);
      setTimeout(() => {
        expect(fired).to.be.false;
        done();
      });
    });
    it('remove listener with id', (done) => {
      let newHandler = DomUtils.on(`click${index}`, fireFn, 1);
      DomUtils.off(`click${index}`, newHandler);
      DomUtils.trigger(`click${index}`);
      setTimeout(() => {
        expect(fired).to.be.false;
        done();
      });
    });
  });
  describe('visibility', function () {
    let div, visible, notVisible, inViewport, leftOfViewport, rightOfViewport, aboveViewport,
        belowViewport, notDisplayed, zeroOpacity, zIndex1, zIndex2;
    before(() => {
      div = document.createElement('div');
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
      div.parentNode.removeChild(div);
    });
    it('isVisible = true', () => {
      expect(DomUtils.isVisible(div)).to.be.true;
      expect(DomUtils.isVisible(visible)).to.be.true;
      expect(DomUtils.isVisible(inViewport)).to.be.true;
      expect(DomUtils.isVisible(zIndex2)).to.be.true;
    });
    it('isVisible = false', () => {
      expect(DomUtils.isVisible(notDisplayed)).to.be.false;
      expect(DomUtils.isVisible(notVisible)).to.be.false;
      expect(DomUtils.isVisible(document.createElement('div'))).to.be.false;
      expect(DomUtils.isVisible(zIndex1)).to.be.false;
      expect(DomUtils.isVisible(zeroOpacity)).to.be.false;
      expect(DomUtils.isVisible(leftOfViewport)).to.be.false;
      expect(DomUtils.isVisible(rightOfViewport)).to.be.false;
      expect(DomUtils.isVisible(aboveViewport)).to.be.false;
      expect(DomUtils.isVisible(belowViewport)).to.be.false;
    });
  });
});
