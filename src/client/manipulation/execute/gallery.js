/**
 * Proudly created by ohad on 25/12/2016.
 */
const _            = require('../../common/util/wrapper'),
      StubExecutor = require('./stub'),
      css          = require('./gallery.css');
_.css.load(css);
const styles                = css.locals;
/**
 * A prefix to all galleries.
 * @type {string}
 */
const _idPrefix             = 'brainpal-gallery-component';
/**
 * Maintains the current item displayed in the gallery.
 * @type {string}
 */
const _currentAttribute     = 'data-brainpal-current';
/**
 * Whether the gallery is animating.
 * @type {string}
 */
const _isAnimatingAttribute = 'data-brainpal-is-animating';
/**
 * Creates a gallery and injects it into elements[0].
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {string|Array.<string>} sourceSelectors - provided as css selectors
 *  @property {string} [animationClass = fxSoftScale]
 */
exports.execute = function (elements, specs) {
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('GalleryExecutor: Invalid input.');
    }
    elements[0].appendChild(_createGallery(specs));
};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    if (!StubExecutor.preconditions(elements, specs)) return false;
    if (elements.length !== 1) return false;
    if (!_.has(specs, 'sourceSelectors')) return false;
    if (!_.isArray(specs.sourceSelectors) && !_.isString(specs.sourceSelectors)) return false;
    if (_.has(specs, 'animationClass') && !_.includes(_animationClasses, specs.animationClass)) {
        return false;
    }
    if (_.has(specs, 'id') && !_.isString(specs.id)) return false;
    if (_.isString(specs.sourceSelectors)) {
        return !!document.querySelectorAll(specs.sourceSelectors).length;
    }
    for (let i = 0; i < specs.sourceSelectors.length; i++) {
        if (document.querySelectorAll(specs.sourceSelectors[i]).length) return true;
    }

    return false;
};

/**
 * @param {Object} specs
 * @returns {Element}
 * @private
 */
function _createGallery(specs) {
    let sources           = [], component, ul;
    specs.sourceSelectors =
        _.isArray(specs.sourceSelectors) ? specs.sourceSelectors : [specs.sourceSelectors];
    _.forEach(specs.sourceSelectors, (sel) => {
        let newSrcs = document.querySelectorAll(sel);
        _.forEach(newSrcs, (elem) => {
            sources.push(elem.cloneNode(true));
        })
    });
    component = document.createElement('div');
    component.classList.add(styles.component, styles.fullwidth,
                            styles[specs.animationClass || 'fxSoftScale']);
    component.setAttribute('id', _idPrefix + (specs.id ? `-${specs.id}` : ''));
    ul = document.createElement('ul');
    ul.classList.add(styles.itemwrap);
    _.forEach(sources, (elem) => {
        // TODO(ohad): support multiple elements per item.
        let li = document.createElement('li');
        li.appendChild(elem);
        if (elem.nodeName.toLowerCase() === 'img') {
            elem.classList.add(
                elem.naturalHeight > elem.naturalWidth ? styles.narrow : styles.wide);
        }
        ul.appendChild(li);
    });
    component.appendChild(ul);
    _play(component, specs);
    return component;
}

/**
 * Start auto navigation in the gallery.
 * @param {Element} component
 * @param {Object} specs
 * @private
 */
function _play(component, specs) {
    const intervalMs = specs.interval || 6000;
    let intervalId   = setInterval(function () {
        _navigate(NavigationDirection.PREVIOUS, component);
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
}

/**
 * @param {string} direction - whether to move to next or pervious item.
 * @param {Element} component - the gallery container
 * @private
 */
function _navigate(direction, component) {
    if (component.getAttribute(_isAnimatingAttribute) === 'true') return;
    let items = component.querySelector(`ul.${styles.itemwrap}`).children;
    component.setAttribute(_isAnimatingAttribute, 'true');
    let current         = _.parseInt(component.getAttribute(_currentAttribute));
    let animationsCount = 0;


    let currentItem = items[current];

    if (direction === NavigationDirection.NEXT) {
        current = current < items.length - 1 ? current + 1 : 0;
    }
    else if (direction === NavigationDirection.PREVIOUS) {
        current = current > 0 ? current - 1 : items.length - 1;
    }
    component.setAttribute(_currentAttribute, _.toString(current));

    let nextItem = items[current];

    const onEndAnimationCurrentItem = function () {
        this.removeEventListener('animationend', onEndAnimationCurrentItem);
        this.classList.remove(styles.current,
                              direction === NavigationDirection.NEXT ? styles.navOutNext :
                              styles.navOutPrev);
        ++animationsCount;
        if (animationsCount === 2) {
            component.setAttribute(_isAnimatingAttribute, 'false');
        }
    };

    const onEndAnimationNextItem = function () {
        this.removeEventListener('animationend', onEndAnimationNextItem);
        this.classList.remove(
            direction === NavigationDirection.NEXT ? styles.navInNext : styles.navInPrev);
        this.classList.add(styles.current);
        ++animationsCount;
        if (animationsCount === 2) {
            component.setAttribute(_isAnimatingAttribute, 'false');
        }
    };

    currentItem.addEventListener('animationend', onEndAnimationCurrentItem);
    nextItem.addEventListener('animationend', onEndAnimationNextItem);
    currentItem.classList.add(
        direction === NavigationDirection.NEXT ? styles.navOutNext : styles.navOutPrev);
    nextItem.classList.add(direction === NavigationDirection.NEXT ? styles.navInNext :
                           styles.navInPrev);
}

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