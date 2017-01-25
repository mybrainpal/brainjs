/**
 * Proudly created by ohad on 25/12/2016.
 */
const expect           = require('chai').expect,
      _                = require('../../../../common/util/wrapper'),
      BaseError        = require('../../../../common/log/base.error.js'),
      GalleryExecutor  = require('./gallery'),
      GalleryInterface = require('./interface'),
      styles           = require('./gallery.scss').locals;

describe('GalleryExecutor', function () {
  this.timeout(3000);
  let div, imgNarrow, imgWide, container, smallContainer, options, animationSpec;
  before(() => {
    div = document.createElement('div');
    div.setAttribute('id', 'div');
    imgNarrow      = document.createElement('img');
    imgWide        = document.createElement('img');
    container      = document.createElement('div');
    smallContainer = document.createElement('div');
    options        = {sourceSelectors: '#div img', container: '#container'};
    animationSpec  = _.deepExtend({interval: 100, animationClass: 'fxSnapIn'}, options);
    document.querySelector('body').appendChild(div);
    imgNarrow.src = ''; //'img/sad.jpg';
    imgNarrow.setAttribute('narrow', 'true');
    imgWide.src = ''; //'img/diving.jpg';
    imgWide.setAttribute('wide', 'true');
    container.setAttribute('id', 'container');
    smallContainer.setAttribute('id', 'small');
    smallContainer.style = 'width: 100px; height: 100px';
    div.appendChild(smallContainer);
    div.appendChild(container);
    div.appendChild(imgNarrow);
    div.appendChild(imgWide);
  });
  afterEach(() => {
    document.querySelectorAll(`.${styles.component}`).forEach((component) => {
      component.parentNode.removeChild(component);
    })
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('preconditions', () => {
    expect(() => {GalleryExecutor.preconditions(options)}).to.not.throw(Error);
    expect(() => {
      GalleryExecutor.preconditions({sourceSelectors: 'img', container: '#nada'})
    }).to.throw(BaseError);
    expect(() => {GalleryExecutor.preconditions({})}).to.throw(BaseError);
    expect(() => {
      GalleryExecutor.preconditions({sourceSelectors: '#nada', container: 'div'})
    }).to.throw(BaseError);
    expect(() => {
      GalleryExecutor.preconditions(_.deepExtend({animationClass: '1'}, options))
    }).to.throw(BaseError);
  });
  it('creation', () => {
    GalleryExecutor.execute(options);
    expect(container.querySelectorAll(`div.${styles.component} img`)).to.have.length(2);
  });
  it('interface', (done) => {
    GalleryInterface.execute(options);
    setTimeout(() => {
      expect(container.querySelectorAll(`div.${styles.component} img`)).to.have.length(2);
      done();
    });
  });
  it('assign animation class', () => {
    GalleryExecutor.execute(animationSpec);
    expect(container.querySelector(`.${styles.fxSnapIn}`)).to.be.ok;
  });
  it('animation', (done) => {
    GalleryExecutor.execute(animationSpec);
    expect(container.querySelector(`li.${styles.current}`).classList
                    .contains(styles.navOutNext)).to.be.false;
    setTimeout(() => {
      expect(container.querySelector(`li.${styles.current}`).classList
                      .contains(styles.navOutNext)).to.be.true;
      done()
    }, 200);
  });
  it('animation responds to mouse', (done) => {
    GalleryExecutor.execute(animationSpec);
    container.querySelector(`.${styles.component}`).dispatchEvent(new Event('mouseover'));
    setTimeout(() => {
      expect(container.querySelector(`li.${styles.current}`).classList
                      .contains(styles.navOutNext)).to.be.false;
      container.querySelector(`.${styles.component}`).dispatchEvent(new Event('mouseout'));
    }, 200);
    setTimeout(() => {
      expect(container.querySelector(`li.${styles.current}`).classList
                      .contains(styles.navOutNext)).to.be.true;
      done();
    }, 400);
  });
  it('multiple galleries', () => {
    GalleryExecutor.execute(_.deepExtend({id: 1}, options));
    GalleryExecutor.execute(_.deepExtend({}, options, {id: 2, container: '#small'}));
    expect(document.querySelectorAll(`.${styles.component}`)).to.have.length(2);
  });
  it('narrow and wide', () => {
    imgNarrow.src = require("./testdata/sad.jpg");
    imgWide.src   = require("./testdata/diving.jpg");
    GalleryExecutor.execute(_.deepExtend({}, options, {container: '#small'}));
    expect(smallContainer.querySelector(`img.${styles.narrow}`).clientWidth).to.be.at.least(
      smallContainer.clientWidth);
    expect(smallContainer.querySelector(`img.${styles.narrow}`).clientHeight).to.equal(
      smallContainer.clientHeight);
    expect(smallContainer.querySelector(`img.${styles.wide}`).clientWidth).to.equal(
      smallContainer.clientWidth);
    expect(smallContainer.querySelector(`img.${styles.wide}`).clientHeight).to.be.at.least(
      smallContainer.clientHeight);
  });
});