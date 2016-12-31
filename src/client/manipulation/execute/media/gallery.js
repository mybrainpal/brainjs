/**
 * Proudly created by ohad on 25/12/2016.
 */
const _            = require('../../../common/util/wrapper'),
      StubExecutor = require('../stub'),
      css          = require('./gallery.css');
_.css.load(css);
const styles                   = css.locals;
/**
 * A prefix to all galleries.
 * @type {string}
 */
const _idPrefix                = 'brainpal-gallery-component';
/**
 * Maintains the current item displayed in the gallery.
 * @type {string}
 */
const _currentAttribute        = 'data-brainpal-current';
/**
 * Whether the gallery is animating.
 * @type {string}
 */
const _animationCountAttribute = 'data-brainpal-animation-count';
/**
 * Available animation classes.
 * @type Array<string>
 * @private
 */
const _animationClasses =
          ['fxSoftScale', 'fxPressAway', 'fxSideSwing', 'fxFortuneWheel', 'fxPushReveal',
           'fxSnapIn',
           'fxLetMeIn', 'fxStickIt', 'fxArchiveMe', 'fxSlideBehind', 'fxEarthquake',
           'fxCliffDiving'];

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
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 *  @property {string|Array.<string>} sourceSelectors - provided as css selectors
 *  @property {string} [animationClass = fxSoftScale]
 *  @property {string|number} id
 */
exports.execute = function (elements, options) {
    if (!exports.preconditions(elements, options)) {
        throw new TypeError('GalleryExecutor: Invalid input.');
    }
    elements[0].appendChild(_createGallery(options));
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} options
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, options) {
    if (!StubExecutor.preconditions(elements, options)) return false;
    if (elements.length !== 1) return false;
    if (!options.sourceSelectors) return false;
    if (!_.isArray(options.sourceSelectors) && !_.isString(options.sourceSelectors)) return false;
    if (options.animationClass && !_.includes(_animationClasses, options.animationClass)) {
        return false;
    }
    if (options.id && !_.isString(options.id) && !_.isNumber(options.id)) return false;
    if (_.isString(options.sourceSelectors)) {
        try { return !!document.querySelectorAll(options.sourceSelectors).length; }
        catch (e) { return false; }
    }
    for (let i = 0; i < options.sourceSelectors.length; i++) {
        if (document.querySelectorAll(options.sourceSelectors[i]).length) return true;
    }

    return false;
};

/**
 * @param {Object} options
 * @returns {Element}
 * @private
 */
function _createGallery(options) {
    let sources           = [], component, ul;
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
    component.setAttribute('id', _idPrefix + (options.id ? `-${_.toString(options.id)}` : ''));
    ul = document.createElement('ul');
    ul.classList.add(styles.itemwrap);
    _.forEach(sources, (elem) => {
        // TODO(ohad): support multiple elements per item.
        let li = document.createElement('li');
        li.appendChild(elem);
        if (elem.nodeName.toLowerCase() === 'img') {
            const componentRatio = component.clientWidth / component.clientHeight;
            const imgRatio       = elem.clientWidth / elem.clientHeight;
            elem.classList.add(componentRatio > imgRatio ? styles.narrow : styles.wide);
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