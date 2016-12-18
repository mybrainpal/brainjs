/**
 * Proudly created by ohad on 18/12/2016.
 */
/**
 * @param {Node,string} elem
 * @returns {string} returns the text contents of the specified element.
 */
exports.text = function (elem) {
    var res = '', i;
    if (typeof elem === 'string') {
        elem = document.querySelector(elem);
    }

    if (elem && elem.nodeType === Node.TEXT_NODE) {
        res += elem.textContent;
    } else if (elem && elem.childNodes && elem.nodeType !== Node.COMMENT_NODE) {
        for (i = 0; i < elem.childNodes.length; i++) {
            res += exports.text(elem.childNodes[i]);
        }
    }

    return res;
};