/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Locates DOM nodes based on a json description.
 */
var Logger = require('./log/logger'),
    Level = require('./log/logger').Level;

/**
 * @param {Object} description
 *  @property {string} [id]
 *  @property {Array.<string>} [classes] - the node classes.
 *  @property {Object} [parent] - description to the parent node.
 *  @property {string} [tag] - lowercased, for <div> it'll be 'div'
 *  @property {{string,string}} [attributes] - <span foo='brain' bar ='pal'> will yield
 *                                             {foo:'brain', bar:'pal'}.
 *                                             Values may be truncated.
 *  @property {string} [textContent] - <div>foo</div> will yield 'foo'. May be truncated.
 *  @property {number} [childNodeIndex] - <div><img><img><img id='foo'></div>, for #img#foo
 *                                        it'll be 2.
 * @param {Object} [options]
 *  @property {boolean} [logFailure=true] - whether to log failure to find.
 *  @property {boolean} [quickRun=true] - whether to return best match as soon as there is a single
 *                                        alternative.
 *   @property {boolean} [requireSingleFit=true] - returns a match when there is only a single fit.
 * @returns {Node} that best matches the description.
 */
function locate(description, options) {
    var elem,
        defaultOptions = {logFailure: false, quickRun: true, requireSingleFit: true},
        parent,
        parentDescription,
        alternatives = [],
        elems, i, firstMatch;
    options = options || {};
    if (description.hasOwnProperty('tag')) {
        if (description.tag == 'document') {
            return document;
        }
    }
    if (description.hasOwnProperty('id')) {
        elem = document.getElementById(description.id);
        alternatives.push(elem);
        if (alternatives.length === 1
            && (!options.hasOwnProperty('quickRun') || options.quickRun)) {
            return alternatives[0];
        }
    }
    if (description.hasOwnProperty('parent')) {
        parent = locate(description.parent, defaultOptions);
        if (parent instanceof Element) {
            description.parentNode = parent;
            elems = parent.childNodes;
            for (i = 0; i < elems.length; i++) {
                if (_isMatch(elems[i], description)) {
                    alternatives.push(elems[i])
                }
            }
            if (alternatives.length === 1
                && (!options.hasOwnProperty('quickRun') || options.quickRun)) {
                return alternatives[0];
            }
        }
    }
    if (description.hasOwnProperty('classes')) {
        elems = document.getElementsByClassName(description.classes[0]);
        for (i = 0; i < elems.length; i++) {
            if (_isMatch(elems[i], description)) {
                alternatives.push(elems[i])
            }
        }
        if (alternatives.length === 1
            && (!options.hasOwnProperty('quickRun') || options.quickRun)) {
            return alternatives[0];
        }
    }
    if (description.hasOwnProperty('tag')) {
        elems = document.getElementsByTagName(description.tag);
        for (i = 0; i < elems.length; i++) {
            if (_isMatch(elems[i], description)) {
                alternatives.push(elems[i])
            }
        }
        if (alternatives.length === 1
            && (!options.hasOwnProperty('quickRun') || options.quickRun)) {
            return alternatives[0];
        }
    }
    if (description.hasOwnProperty('_childNodeIndex')) {
        firstMatch = -1;
        for (i = 0; i < alternatives.length; i++) {
            if (_childNodeIndex(alternatives[i]) === description.childNodeIndex) {
                if (firstMatch == -1) {
                    firstMatch = i;
                } else if (options.hasOwnProperty('requireSingleFit') && !options.requireSingleFit) {
                    return alternatives[firstMatch];
                }
            }
        }
    }
    if (alternatives.length == 1
        || (options.hasOwnProperty('requireSingleFit')
            && !options.requireSingleFit)) {
        // Returns first matching element. Since all the above commands are order preserving, the
        // element returned should be consistent.
        if (alternatives) {
            return alternatives[0];
        }
    }
    if (options.hasOwnProperty('logFailure') && !options.logFailure) {
        return null;
    }
    Logger.log(Level.INFO, 'Locator: could not locate ' + JSON.stringify(description));
}
module.exports.locate = locate;

/**
 * @param {Element} element
 * @param {Object} description
 *  @property {string} [id]
 *  @property {Array.<string>} [classes] - the node classes.
 *  @property {Element} [parentNode] - the actual parent node.
 *  @property {string} [tag] - lowercased, for <div> it'll be 'div'
 *  @property {{string,string}} [attributes] - <span foo='brain' bar ='pal'> will yield
 *                                             {foo:'brain', bar:'pal'}
 *  @property {string} [textContent] - <div>foo</div> will yield 'foo'. May be truncated.
 * @returns {boolean} whether element matches description.
 * @private
 */
function _isMatch(element, description) {
    var i, classList, att;
    if (description.hasOwnProperty('id') &&
        element.hasAttribute('id') &&
        element.getAttribute('id') != description.id) {
        return false;
    }
    if (description.hasOwnProperty('parent') && element.parentNode !== description.parentNode) {
        return false;
    }
    if (description.hasOwnProperty('tag') && element.tagName.toLowerCase() !== description.tag) {
        return false;
    }
    if (description.hasOwnProperty('classes')) {
        classList = element.classList;
        for (i = 0; i < description.classes.length; i++) {
            if (!classList.contains(description.classes[i])) {
                return false;
            }
        }
    }
    if (description.hasOwnProperty('attributes')) {
        for (att in description.attributes) {
            if (description.attributes.hasOwnProperty(att) && !element.getAttribute(att).includes(description.attributes[att])) {
                return false;
            }
        }
    }
    if (description.hasOwnProperty('textContent')) {
        if (!element.textContent.includes(description.textContent)) {
            return false;
        }
    }
    return true;
}

/**
 * @param {Element} element
 * @returns {number} index number of element within element.parentNode.childNodes. If no parent
 *                   exists, returns 0.
 * @private
 */
function _childNodeIndex(element) {
    var siblings, i;
    if (element.parentNode) {
        siblings = element.parentNode.childNodes;
        for (i = 0; i < siblings.length; i++) {
            if (siblings[i].isSameNode(element)) {
                return i;
            }
        }
    }
    return 0;
}
