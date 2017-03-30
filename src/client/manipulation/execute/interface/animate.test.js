/**
 * Proudly created by ohad on 10/03/2017.
 */
let expect           = require('chai').expect,
    $                = require('../../../common/util/dom'),
    BaseError        = require('../../../common/log/base.error'),
    AnimateInterface = require('./animate');

// Test is unstable.
describe.skip('AnimateInterface', function () {
  let div, id = 0, divId, animationName;
  this.timeout(5000);
  before(() => {
    divId = 'lorenz-buffel';
    div   = $.div({id: divId, style: {width: '100px', height: '100px', 'background-color': 'red'}});
    $('body').appendChild(div);
    animationName = 'bounceIn';
  });
  beforeEach(() => {
    id++;
  });
  after(() => {
    div.parentNode.removeChild(div);
  });
  it('preconditions', () => {
    expect(() => {
      AnimateInterface.preconditions({target: `#${divId}`, animationName: animationName})
    }).to.not.throw(Error);
    expect(() => {AnimateInterface.preconditions({})}).to.throw(BaseError);
    expect(() => {
      AnimateInterface.preconditions({target: '#malle-zuruck', animationName: animationName})
    }).to.throw(BaseError);
    expect(() => {
      AnimateInterface.preconditions({target: `#${divId}`, animationName: 1})
    }).to.throw(BaseError);
    expect(() => {
      AnimateInterface.preconditions({target: `#${divId}`})
    }).to.throw(BaseError);
  });
  it('animate', (done) => {
    AnimateInterface.execute({id: id, target: `#${divId}`, animationName: animationName});
    setTimeout(() => {
      expect(div.classList.contains('animated')).to.be.true;
      expect(div.classList.contains('bounceIn')).to.be.true;
      expect(getComputedStyle(div).animationName).to.eq(animationName);
      setTimeout(() => {
        expect(div.classList.contains('animated')).to.be.false;
        expect(div.classList.contains('bounceIn')).to.be.false;
        expect(getComputedStyle(div).animationName).to.not.eq(animationName);
        done();
      }, 2000);
    }, 10);
  });
  it('animate twice', (done) => {
    AnimateInterface.execute({id: id, target: `#${divId}`, animationName: animationName});
    setTimeout(() => {
      expect(div.classList.contains('animated')).to.be.true;
      expect(div.classList.contains('bounceIn')).to.be.true;
      expect(getComputedStyle(div).animationName).to.eq(animationName);
      setTimeout(() => {
        expect(div.classList.contains('animated')).to.be.false;
        expect(div.classList.contains('bounceIn')).to.be.false;
        expect(getComputedStyle(div).animationName).to.not.eq(animationName);
        id++;
        AnimateInterface.execute({id: id, target: `#${divId}`, animationName: animationName});
        setTimeout(() => {
          expect(div.classList.contains('animated')).to.be.true;
          expect(div.classList.contains('bounceIn')).to.be.true;
          expect(getComputedStyle(div).animationName).to.eq(animationName);
          setTimeout(() => {
            expect(div.classList.contains('animated')).to.be.false;
            expect(div.classList.contains('bounceIn')).to.be.false;
            expect(getComputedStyle(div).animationName).to.not.eq(animationName);
            done();
          }, 2000);
        }, 10)
      }, 2000);
    }, 10);
  });
});