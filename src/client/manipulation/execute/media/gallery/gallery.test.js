/**
 * Proudly created by ohad on 25/12/2016.
 */
const expect           = require('chai').expect,
      _                = require('../../../../common/util/wrapper'),
      $                = require('../../../../common/util/dom'),
      BaseError        = require('../../../../common/log/base.error.js'),
      GalleryExecutor  = require('./gallery'),
      GalleryInterface = require('./interface'),
      styles           = require('./gallery.scss').locals;

describe('GalleryExecutor', function () {
  this.timeout(3000);
  let div, options, animationSpec;
  before(() => {
    options       = {sourceSelectors: '#div img', container: '#container'};
    animationSpec = _.extend({interval: 100, animationClass: 'fxSnapIn'}, options);
    div           = $.div({id: 'div'},
                          $.div({id: 'small', style: {width: '100px', height: '100px'}}),
                          $.div({id: 'container'}),
                          $.img({src: require('./testdata/sad.jpg')}),
                          $.img({src: require('./testdata/diving.jpg')})
    );
    document.querySelector('body').appendChild(div);
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
      GalleryExecutor.preconditions(_.extend({animationClass: '1'}, options))
    }).to.throw(BaseError);
  });
  it('creation', () => {
    GalleryExecutor.execute(options);
    expect(document.querySelectorAll(`#container div.${styles.component} img`)).to.have.length(2);
  });
  it('interface', (done) => {
    GalleryInterface.execute(options);
    setTimeout(() => {
      expect(document.querySelectorAll(`#container div.${styles.component} img`)).to.have.length(2);
      done();
    });
  });
  it('assign animation class', () => {
    GalleryExecutor.execute(animationSpec);
    expect(document.querySelector(`#container .${styles.fxSnapIn}`)).to.be.ok;
  });
  it('animation', (done) => {
    GalleryExecutor.execute(animationSpec);
    expect(document.querySelector(`#container li.${styles.current}`).classList
                   .contains(styles.navOutNext)).to.be.false;
    setTimeout(() => {
      expect(document.querySelector(`#container li.${styles.current}`).classList
                     .contains(styles.navOutNext)).to.be.true;
      done()
    }, 200);
  });
  it('animation responds to mouse', (done) => {
    GalleryExecutor.execute(animationSpec);
    document.querySelector(`#container .${styles.component}`).dispatchEvent(new Event('mouseover'));
    setTimeout(() => {
      expect(document.querySelector(`#container li.${styles.current}`).classList
                     .contains(styles.navOutNext)).to.be.false;
      document.querySelector(`#container .${styles.component}`)
              .dispatchEvent(new Event('mouseout'));
    }, 200);
    setTimeout(() => {
      expect(document.querySelector(`#container li.${styles.current}`).classList
                     .contains(styles.navOutNext)).to.be.true;
      done();
    }, 400);
  });
  it('multiple galleries', () => {
    GalleryExecutor.execute(_.extend({id: 1}, options));
    GalleryExecutor.execute(_.extend({}, options, {id: 2, container: '#small'}));
    expect(document.querySelectorAll(`.${styles.component}`)).to.have.length(2);
  });
  it('narrow and wide', () => {
    GalleryExecutor.execute(_.extend({}, options, {container: '#small'}));
    expect(
      document.querySelector(`#small img.${styles.narrow}`).clientWidth).to.be.at.least(100);
    expect(document.querySelector(`#small img.${styles.narrow}`).clientHeight).to.equal(100);
    expect(document.querySelector(`#small img.${styles.wide}`).clientWidth).to.equal(100);
    expect(document.querySelector(`#small img.${styles.wide}`).clientHeight).to.be.at.least(100);
  });
});