/**
 * Proudly created by ohad on 25/12/2016.
 */
var _            = require('./../../common/util/wrapper'),
    StubExecutor = require('./stub');
/**
 * Creates a gallery and injects it into elements[0].
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 *  @property {string|Array.<string>} sourceSelectors - provided as css selectors
 *  @property {string} [animationClass = SoftScale]
 */
exports.execute = function (elements, specs) {
    var sources = [];
    if (!exports.preconditions(elements, specs)) {
        throw new TypeError('GalleryExecutor: Invalid input.');
    }
    specs.sourceSelectors =
        _.isArray(specs.sourceSelectors) ? specs.sourceSelectors : [specs.sourceSelectors];
    _.forEach(specs.sourceSelectors, function (sel) {
        var newSrcs = document.querySelectorAll(sel);
        _.forEach(newSrcs, function (src) {
            sources.push(src.cloneNode(true));
        })
    });

};

/**
 * @param {Array.<Element>|NodeList} elements
 * @param {Object} specs
 * @returns {boolean} whether the executor has a valid input.
 */
exports.preconditions = function (elements, specs) {
    return StubExecutor.preconditions(elements, specs) && elements.length !== 1 &&
           _.has(specs, 'sourceSelectors') &&
           (_.isArray(specs.sourceSelectors) || _.isString(specs.sourceSelectors));
};

/**
 * @param {Array.<Element>|NodeList} elems
 * @returns {Element}
 * @private
 */
function _createGallery(elems) {

}