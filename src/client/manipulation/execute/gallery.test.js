/**
 * Proudly created by ohad on 25/12/2016.
 */
const expect          = require('chai').expect,
      _               = require('../../common/util/wrapper'),
      GalleryExecutor = require('./gallery'),
      styles          = require('./gallery.css').locals;
require("file-loader?name=img/[name].[ext]!./testdata/sad.jpg");
require("file-loader?name=img/[name].[ext]!./testdata/diving.jpg");

describe.only('GalleryExecutor', function () {
    this.timeout(5000);
    let div            = document.createElement('div');
    let imgNarrow      = document.createElement('img');
    let imgWide        = document.createElement('img');
    let container      = document.createElement('div');
    let smallContainer = document.createElement('div');
    const spec         = {sourceSelectors: 'img'};
    document.querySelector('body').appendChild(div);
    imgNarrow.src = 'img/sad.jpg';
    imgNarrow.setAttribute('narrow', 'true');
    imgWide.src = 'img/diving.jpg';
    imgWide.setAttribute('wide', 'true');
    container.setAttribute('id', 'container');
    smallContainer.setAttribute('id', 'small');
    smallContainer.style = 'width: 100px; height: 100px';
    div.appendChild(smallContainer);
    div.appendChild(container);
    div.appendChild(imgNarrow);
    div.appendChild(imgWide);
    afterEach(() => {
        _.forEach(_.union(container.children, smallContainer.children), (elem) => {
            elem.parentNode.removeChild(elem);
        });
    });
    after(() => {
        div.parentNode.removeChild(div);
    });
    it('preconditions', () => {
        expect(GalleryExecutor.preconditions([container], spec)).to.be.true;
        expect(GalleryExecutor.preconditions([container, smallContainer],
                                             spec)).to.be.false;
        expect(GalleryExecutor.preconditions([container], {})).to.be.false;
        expect(GalleryExecutor.preconditions([container], {sourceSelectors: '#nada'})).to.be.false;
        expect(GalleryExecutor.preconditions([container], {sourceSelectors: 1})).to.be.false;
        expect(GalleryExecutor.preconditions([container], _.merge({id: 1}, spec))).to.be.false;
        expect(GalleryExecutor.preconditions([container],
                                             _.merge({animationClass: '1'}, spec))).to.be.false;
    });
    it('creation', () => {
        GalleryExecutor.execute([container], spec);
        expect(container.querySelectorAll('img')).to.have.length(2);
    });
    it('assign animation class', () => {
        GalleryExecutor.execute([container], _.merge({animationClass: 'fxSnapIn'}, spec));
        expect(container.querySelector(`.${styles.fxSnapIn}`)).to.be.ok;
    });
    it('animation', (done) => {
        GalleryExecutor.execute([container],
                                _.merge({interval: 600, animationClass: 'fxSnapIn'}, spec));
        _.forEach(container.querySelectorAll('li'),
                  (li) => {li.addEventListener('animationend', () => {done()})});
    });
    it('animation responds to mouse', (done) => {
        GalleryExecutor.execute([container],
                                _.merge({interval: 600, animationClass: 'fxSnapIn'}, spec));
        const errorFn = function () {
            done('animation started too early');
        };
        _.forEach(container.querySelectorAll('li'),
                  (li) => {li.addEventListener('animationend', errorFn)});
        container.querySelector(`.${styles.component}`).dispatchEvent(new Event('onmouseover'));
        setTimeout(() => {
            container.querySelector(`.${styles.component}`).dispatchEvent(new Event('onmouseout'));
            _.forEach(container.querySelectorAll('li'),
                      (li) => {
                          li.removeEventListener('animationend', errorFn);
                          li.addEventListener('animationend', () => {done()})
                      });
        }, 1000);
    });
    it('multiple galleries', () => {
        GalleryExecutor.execute([container], _.merge({id: '1'}, spec));
        GalleryExecutor.execute([smallContainer], _.merge({id: '2'}, spec));
        expect(document.querySelectorAll(`.${styles.component}`)).to.have.length(2);
    });
    it('narrow and wide', () => {
        GalleryExecutor.execute([smallContainer], spec);
        expect(smallContainer.querySelector('img[narrow]').clientWidth).to.equal(100);
        expect(smallContainer.querySelector('img[narrow]').clientHeight).to.be.above(100);
        expect(smallContainer.querySelector('img[wide]').clientWidth).to.above(100);
        expect(smallContainer.querySelector('img[wide]').clientHeight).to.be.equal(100);
    });
});