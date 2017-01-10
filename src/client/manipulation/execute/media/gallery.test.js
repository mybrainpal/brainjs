/**
 * Proudly created by ohad on 25/12/2016.
 */
const expect          = require('chai').expect,
      _               = require('../../../common/util/wrapper'),
      GalleryExecutor = require('./gallery'),
      styles          = require('./gallery.scss').locals;

describe('GalleryExecutor', function () {
    this.timeout(3000);
    let div, imgNarrow, imgWide, container, smallContainer, spec, animationSpec;
    before(() => {
        div            = document.createElement('div');
        div.setAttribute('id', 'div');
        imgNarrow      = document.createElement('img');
        imgWide        = document.createElement('img');
        container      = document.createElement('div');
        smallContainer = document.createElement('div');
        spec = {sourceSelectors: '#div img', container: '#container'};
        animationSpec = _.deepExtend({interval: 100, animationClass: 'fxSnapIn'}, spec);
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
        let i;
        for (i = 0; i < container.children.length; i++) {
            container.children[i].parentNode.removeChild(container.children[i]);
        }
        for (i = 0; i < smallContainer.children.length; i++) {
            smallContainer.children[i].parentNode.removeChild(smallContainer.children[i]);
        }
        document.querySelectorAll('style[' + _.css.identifyingAttribute + ']')
                .forEach(function (styleElement) {
                    styleElement.parentNode.removeChild(styleElement);
                });
    });
    after(() => {
        div.parentNode.removeChild(div);
    });
    it('preconditions', () => {
        expect(GalleryExecutor.preconditions(spec)).to.be.true;
        expect(GalleryExecutor.preconditions(
            {sourceSelectors: 'img', container: '#nada'})).to.be.false;
        expect(GalleryExecutor.preconditions({})).to.be.false;
        expect(GalleryExecutor.preconditions(
            {sourceSelectors: '#nada', container: 'div'})).to.be.false;
        expect(
            GalleryExecutor.preconditions(_.deepExtend({animationClass: '1'}, spec))).to.be.false;
    });
    it('creation', () => {
        GalleryExecutor.execute(spec);
        expect(container.querySelectorAll(`div.${styles.component} img`)).to.have.length(2);
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
        GalleryExecutor.execute(_.deepExtend({id: 1}, spec));
        GalleryExecutor.execute(_.deepExtend({}, spec, {id: 2, container: '#small'}));
        expect(document.querySelectorAll(`.${styles.component}`)).to.have.length(2);
    });
    // it('narrow and wide', () => {
    //     require("file-loader?name=img/[name].[ext]?!./testdata/sad.jpg");
    //     require("file-loader?name=img/[name].[ext]?!./testdata/diving.jpg");
    //     GalleryExecutor.execute([smallContainer], spec);
    //     expect(smallContainer.querySelector('img[narrow]').clientWidth).to.equal(100);
    //     expect(smallContainer.querySelector('img[narrow]').clientHeight).to.be.above(100);
    //     expect(smallContainer.querySelector('img[wide]').clientWidth).to.above(100);
    //     expect(smallContainer.querySelector('img[wide]').clientHeight).to.be.equal(100);
    // });
});