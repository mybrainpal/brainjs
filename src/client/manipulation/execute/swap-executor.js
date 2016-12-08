/**
 * Proudly created by ohad on 04/12/2016.
 *
 * Swaps two DOM elements.
 */
var Logger = require('../../common/log/logger'),
    Level = require('../../common/log/logger').Level;

/**
 * Swaps between elements[0] and elements[1].
 * @param {Array} elements
 * @param {Object} [specs]
 */
module.exports.execute = function (elements, specs) {
    var cloned;
    var secondNextSibling;
    var firstNextSibling;
    var firstParent = elements[0].parentNode,
        secondParent = elements[1].parentNode;
    if (firstParent === secondParent) {
        if (elements[0].nextSibling === elements[1] ||
            elements[0].previousSibling === elements[1]) {
            firstParent.insertBefore(elements[1], elements[0]);
            return;
        }
        if (elements[0].nextSibling && elements[0].nextSibling !== elements[1]) {
            firstNextSibling = elements[0].nextSibling;
            firstParent.insertBefore(elements[0], elements[1]);
            firstParent.insertBefore(elements[1], firstNextSibling);
            return;
        }
        if (elements[1].nextSibling && elements[1].nextSibling !== elements[0]) {
            secondNextSibling = elements[1].nextSibling;
            firstParent.insertBefore(elements[1], elements[0]);
            firstParent.insertBefore(elements[0], secondNextSibling);
        }
    }
    cloned = elements[1].cloneNode(true);
    secondParent.insertBefore(cloned, elements[1]);
    firstParent.insertBefore(elements[1], elements[0]);
    secondParent.insertBefore(elements[0], cloned);
    secondParent.removeChild(cloned);
    // TODO(ohad): handle styling bloopers.
};

/**
 * Returns whether the executor has valid input.
 * @param {Object} [specs]
 * @param {*} elements
 */
module.exports.preconditions = function (elements, specs) {
    if (!Array.isArray(elements)) {
        Logger.log(Level.INFO, 'SwapExecutor: variable elements is not an array.');
        return false;
    }
    if (elements.length != 2) {
        Logger.log(Level.INFO, 'SwapExecutor: elements.length != 2.');
        return false;
    }
    if (elements[0].parentNode && elements[1].parentNode) {
        return true;
    }
    Logger.log(Level.INFO, 'SwapExecutor: one or both elements have no parent, kind of sad.');
    return false;
};
