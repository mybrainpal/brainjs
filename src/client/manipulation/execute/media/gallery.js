/**
 * Proudly created by ohad on 25/12/2016.
 */
const _            = require('../../../common/util/wrapper'),
      css    = require('./gallery.scss'),
      Master = require('../master');
Master.register(exports.name, exports);
exports.name = 'gallery';
const styles = css.locals;
/**
 * A prefix to all galleries.
 * @type {string}
 */
exports.idPrefix = 'brainpal-gallery-component';
/**
 * Describes where the gallery navigates to. next is right.
 * @type {{NEXT: string, PREVIOUS: string}}
 */
const NavigationDirection = {
    NEXT    : 'NEXT',
    PREVIOUS: 'PREVIOUS'
};
/**
 * Creates a gallery and injects it into elements[0].
 * @param {Object} options
 *  @property {string} container - selector of container element.
 *  @property {string|Array.<string>} sourceSelectors - provided as css selectors
 *  @property {string} [animationClass = fxSoftScale]
 *  @property {string|number} id
 *  @property {number} interval - time in ms to change items.
 */
exports.execute = function (options) {
    if (!_styleLoaded) {
        _.css.load(css);
        _styleLoaded = true;
    }
    let container = document.querySelector(options.container);
    container.appendChild(_createGallery(container, options));
};

/**
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (options) {
    try {
        if (!document.querySelector(options.container)) return false;
    } catch (e) { return false; }
    if (!options.sourceSelectors) return false;
    if (!_.isArray(options.sourceSelectors) && !_.isString(options.sourceSelectors)) return false;
    const srcSelectors = _.isArray(options.sourceSelectors) ? options.sourceSelectors :
                         [options.sourceSelectors];
    for (let i = 0; i < srcSelectors.length; i++) {
        try { if (!document.querySelector(srcSelectors[i])) return false; }
        catch (e) { return false; }
    }
    if (!_.isNil(options.animationClass) &&
        !_.includes(_animationClasses, options.animationClass)) {
        return false;
    }
    return _.isNil(options.id) || _.isString(options.id) || _.isNumber(options.id);


};

/**
 * @param {Element} container
 * @param {Object} options
 * @returns {Element}
 * @private
 */
function _createGallery(container, options) {
    let sources             = [], component, ul;
    options.sourceSelectors =
        _.isArray(options.sourceSelectors) ? options.sourceSelectors : [options.sourceSelectors];
    _.forEach(options.sourceSelectors, (sel) => {
        let newSrcs = document.querySelectorAll(sel);
        _.forEach(newSrcs, (elem) => {
            sources.push(elem.cloneNode(true));
        })
    });
    component = document.createElement('div');
    component.classList.add(styles.component, styles.fullwidth,
                            styles[options.animationClass || 'fxSoftScale']);
    component.setAttribute('id',
                           exports.idPrefix + (options.id ? `-${_.toString(options.id)}` : ''));
    ul = document.createElement('ul');
    ul.classList.add(styles.itemwrap);
    _.forEach(sources, (elem) => {
        // TODO(ohad): support multiple elements per item.
        let li = document.createElement('li');
        li.appendChild(elem);
        if (elem.nodeName === 'IMG') {
            const containerRatio = container.clientWidth / container.clientHeight;
            const imgRatio       = elem.naturalWidth / elem.naturalHeight;
            elem.classList.add(containerRatio > imgRatio ? styles.narrow : styles.wide);
            elem.removeAttribute('width');
            elem.removeAttribute('height');
            elem.removeAttribute('border');
        }
        ul.appendChild(li);
    });
    component.appendChild(ul);
    _play(component, options);
    return component;
}

/**
 * Start auto navigation in the gallery.
 * @param {Element} component
 * @param {Object} options
 * @private
 */
function _play(component, options) {
    const intervalMs = options.interval || 6000;
    let intervalId   = setInterval(function () {
        _navigate(NavigationDirection.NEXT, component);
    }, intervalMs);
    component.addEventListener('mouseover', function () {
        clearInterval(intervalId);
    });
    component.addEventListener('mouseout', function () {
        intervalId = setInterval(function () {
            _navigate(NavigationDirection.NEXT, component);
        }, intervalMs);
    });
    component.querySelector(`ul.${styles.itemwrap}`).children[0].classList.add(styles.current);
    component.setAttribute(_currentAttribute, _.toString(0));
    component.setAttribute(_animationCountAttribute, _.toString(0));
}

/**
 * @param {string} direction - whether to move to next or pervious item.
 * @param {Element} component - the gallery container
 * @private
 */
function _navigate(direction, component) {
    if (_.parseInt(component.getAttribute(_animationCountAttribute)) > 0) return;
    let items = component.querySelector(`ul.${styles.itemwrap}`).children;
    component.setAttribute(_animationCountAttribute, _.toString(2));
    let current = _.parseInt(component.getAttribute(_currentAttribute));
    let currentItem = items[current];


    if (direction === NavigationDirection.NEXT) {
        current = current < items.length - 1 ? current + 1 : 0;
    }
    else if (direction === NavigationDirection.PREVIOUS) {
        current = current > 0 ? current - 1 : items.length - 1;
    }
    component.setAttribute(_currentAttribute, _.toString(current));

    let nextItem = items[current];

    currentItem.addEventListener('animationend', _onAnimationEnd);
    nextItem.addEventListener('animationend', _onAnimationEnd);
    currentItem.classList.add(
        direction === NavigationDirection.NEXT ? styles.navOutNext : styles.navOutPrev);
    nextItem.classList.add(direction === NavigationDirection.NEXT ? styles.navInNext :
                           styles.navInPrev);
}

/**
 * Handler for gallery items animation end.
 * @private
 */
function _onAnimationEnd() {
    let animationCount = _.parseInt(
        this.parentNode.parentNode.getAttribute(_animationCountAttribute));
    // The first animation is over
    this.parentNode.parentNode.setAttribute(_animationCountAttribute,
                                            _.toString(animationCount - 1));
    if (animationCount < 0) {
        throw new Error('GalleryExecutor: animationCount mustn\'t be negative.');
    }
    this.removeEventListener('animationend', _onAnimationEnd);
    if (this.classList.contains(styles.current)) {
        this.classList.remove(styles.current,
                              styles.navOutNext,
                              styles.navOutPrev);
    } else {
        this.classList.remove(styles.navInNext, styles.navInPrev);
        this.classList.add(styles.current);
    }
}

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded               = false;
/**
 * Maintains the current item displayed in the gallery.
 * @type {string}
 * @private
 */
const _currentAttribute        = 'data-brainpal-current';
/**
 * Whether the gallery is animating.
 * @type {string}
 * @private
 */
const _animationCountAttribute = 'data-brainpal-animation-count';
/**
 * Available animation classes.
 * @type Array<string>
 * @private
 */
const _animationClasses        =
          ['fxSoftScale', 'fxPressAway', 'fxSideSwing', 'fxFortuneWheel', 'fxPushReveal',
           'fxSnapIn', 'fxSoftPulse',
           'fxLetMeIn', 'fxStickIt', 'fxArchiveMe', 'fxSlideBehind', 'fxEarthquake',
           'fxCliffDiving'];
