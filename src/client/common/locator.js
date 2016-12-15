/**
 * Proudly created by ohad on 03/12/2016.
 *
 * Locates DOM nodes based on a json description.
 */
var Logger = require('./log/logger'),
    Level  = require('./log/logger').Level;

/**
 * @param {Object} description
 *  @property {string} [id]
 *  @property {Array.<string>} [classes] - the node classes.
 *  @property {Object} [parent] - description to the parent node.
 *  @property {string} [tag] - lowercased, for <div> it'll be 'div'
 *  @property {{string,string}} [attributes] - <span foo='brain' bar ='pal'> will yield
 *                                             {foo:'brain', bar:'pal'}.
 *                                             Values may be truncated.
 *  @property {string} [textContent] - regex to text content of element.
 *  @property {number} [childNodeIndex] - <div><img><img><img id='foo'></div>, for #img#foo
 *                                        it'll be 2.
 * @param {Object} [options]
 *  @property {boolean} [logFailure=true] - whether to log failure to find.
 *   @property {boolean} [singleMatch=true] - returns a match when there is only a single one.
 * @returns {Node} that best matches the description.
 */
function locate(description, options) {
    var elem,
        alternatives;
    options = options || {};
    if (description.hasOwnProperty('tag') && description.tag == 'document') {
        return document;
    }
    if (description.hasOwnProperty('id')) {
        elem = document.getElementById(description.id);
        if (elem) {
            return elem;
        }
    }
    _prepare(description);
    // Finds potential candidates: by parent, class or tag.
    alternatives = _findCandidates(description);
    // If only one candidate is left, then pick it.
    if (alternatives.length === 1) {
        return alternatives[0];
    }
    if (options.hasOwnProperty('singleMatch') && !options.singleMatch) {
        // Returns first matching element. Since all the above commands are order preserving, the
        // element returned should be consistent.
        if (alternatives) {
            return alternatives[0];
        }
    }
    if (!options.hasOwnProperty('logFailure') || options.logFailure) {
        Logger.log(Level.INFO, 'Locator: could not locate ' + JSON.stringify(description));
    }
    return null;
}
module.exports.locate = locate;

/**
 * @param {Element} element
 * @param {Object} description
 *  @property {string} [id]
 *  @property {Array.<string>} [classes] - the node classes.
 *  @property {Element} [parentElement] - the actual parent node.
 *  @property {string} [tag] - lowercased, for <div> it'll be 'div'
 *  @property {{string,string}} [attributes] - <span foo='brain' bar ='pal'> will yield
 *                                             {foo:'brain', bar:'pal'}
 *  @property {string} [textContent] - regex to text content of element.
 *  @property {number} [childNodeIndex] - <div><img><img><img id='foo'></div>, for #img#foo
 *                                        it'll be 2.
 * @returns {boolean} whether element matches description.
 * @private
 */
function _isMatch(element, description) {
    var i, classList, att;
    if (!(element instanceof Element)) {
        // Bare in mind that the document node is handled in #locate.
        return false
    }
    if (description.hasOwnProperty('id') &&
        element.hasAttribute('id') &&
        element.getAttribute('id') != description.id) {
        return false;
    }
    if (description.hasOwnProperty('parentElement')
        && element.parentElement !== description.parentElement) {
        return false;
    }
    if (description.hasOwnProperty('tag')
        && element.tagName.toLowerCase() !== description.tag) {
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
            if (description.attributes.hasOwnProperty(att)
                && (!element.hasAttribute(att)
                    || !element.getAttribute(att).startsWith(description.attributes[att]))) {
                return false;
            }
        }
    }
    if (description.hasOwnProperty('textContent')
        && !description.textContent.test(element.textContent)) {
        return false;
    }
    return !(description.hasOwnProperty('childNodeIndex')
             && _childNodeIndex(element) !== description.childNodeIndex);
}

/**
 * @param {Element} element
 * @returns {number} index number of element within element.parentElement.childNodes. If no parent
 *                   exists, returns 0.
 * @private
 */
function _childNodeIndex(element) {
    var siblings, i;
    if (element.parentElement) {
        siblings = element.parentElement.children;
        for (i = 0; i < siblings.length; i++) {
            if (siblings[i].isSameNode(element)) {
                return i;
            }
        }
    }
    return 0;
}

/**
 * Prepares description for further use.
 * @param {Object} description
 *  @property {string} [textContent] - regex or string
 *  @property {Object} [parent] - description to parent element.
 * @private
 */
function _prepare(description) {
    var parentElement,
        defaultOptions = {logFailure: false, singleMatch: true};
    if (description.hasOwnProperty('textContent') && !(description.textContent instanceof RegExp)) {
        description.textContent = new RegExp(description.textContent);
    }
    if (description.hasOwnProperty('parent')) {
        parentElement = locate(description.parent, defaultOptions);
        if (parentElement) {
            description.parentElement = parentElement;
        }
    }
}

/**
 * @param {Object} description
 * @returns {*} Collection of potential candidates to match the description.
 * @private
 */
function _findCandidates(description) {
    var elems = [], alternatives = [];
    if (description.hasOwnProperty('parentElement')) {
        elems = description.parentElement.children;
    }
    if (description.hasOwnProperty('classes') && !elems.length) {
        elems = document.getElementsByClassName(description.classes[0]);
    }
    if (description.hasOwnProperty('tag') && !elems.length) {
        elems = document.getElementsByTagName(description.tag);
    }
    if (!elems.length) {
        elems = document.getElementsByTagName('*');
    }
    // Filters the candidates.
    for (i = 0; i < elems.length; i++) {
        if (_isMatch(elems[i], description)) {
            alternatives.push(elems[i])
        }
    }
    return alternatives;
}
