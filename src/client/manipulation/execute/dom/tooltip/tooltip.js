/**
 * Proudly created by nevo on 26/12/2016.
 */
const _         = require('../../../../common/util/wrapper'),
      Logger = require('../../../../common/log/logger'),
      Level  = require('../../../../common/log/logger').Level,
      BaseError = require('../../../../common/log/base.error'),
      Master    = require('../../master'),
      Interface = require('./interface'),
      css       = require('./tooltip.scss');
const styles = css.locals;

/**
 * Creates a tooltip and injects it into element.
 * @param {Object} options
 *  @property {string} target - css selector of target.
 *  @property {number} [timer] - time in ms to hide the tooltip.
 *  @property {string} [type = classic] - the type of the tooltip
 *  @property {string} [htmlContent] - the html content of the tooltip
 *  @property {string|number} [id]
 *  @property {string} [direction] - tooltip's directions: curved(left/right), sharp(left/right)
 *  @property {string|number} [effect] - effect number: flip(1-3), comic(1-2), round(1-5)
 *
 * If the target already has a tooltip it will be overriden.
 */
exports.execute = function (options) {
    if (!_styleLoaded) {
        _.css.load(css);
        _styleLoaded = true;
    }
    const tooltip = _attachTooltip(options);
    if (options.toLog) {
        if (tooltip) {
            if (exports.isVisible(tooltip)) {
                Logger.log(
                    Level.WARNING,
                    `Tooltip (id = ${options.id}) for ${options.target} created and it is visible.`);
            } else {
                Logger.log(
                    Level.INFO,
                    `Tooltip (id = ${options.id}) for ${options.target} created and it is hidden.`);
            }
        } else {
            Logger.log(
                Level.WARNING,
                `Tooltip (id = ${options.id}) for ${options.target} was not created.`);
        }
    }
};

/**
 * @param {Object} options
 */
exports.preconditions = function (options) {
    let target;
    target = document.querySelector(options.target);
    if (!target) {
        throw new BaseError('TooltipExecutor: could not find target at ' + options.target);
    }
    if (options.id && !_.isString(options.id) && !_.isNumber(options.id)) {
        throw new BaseError('TooltipExecutor: id must be string or a number');
    }
    if (!_.isNil(options.timer) && (!Number.isInteger(options.timer) || options.timer <= 0)) {
        throw new BaseError('TooltipExecutor: timer must be nil or a positive integer.');
    }
    if (_.has(options, 'htmlContent') && !_.isString(options.htmlContent)) {
        throw new BaseError('TooltipExecutor: htmlContent must be a string.');
    }
    if (!options.type || !_.isString(options.type)) {
        throw new BaseError('TooltipExecutor: type must be a string.');
    }
    if (!_.has(_tooltipInfo, options.type)) {
        throw new BaseError(`TooltipExecutor: ${options.type} is unknown.`);
    }
    for (let prop in _tooltipInfo[options.type]) {
        if (!_.has(_tooltipInfo[options.type], prop)) continue;
        if (_.isFunction(_tooltipInfo[options.type][prop])) continue;
        if (!Array.isArray(_tooltipInfo[options.type][prop])) {
            throw new BaseError('TooltipExecutor: _tooltipInfo nested properties must be' +
                                ' arrays or functions.');
        }
        if (_tooltipInfo[options.type][prop].indexOf(options[prop]) < 0) {
            throw new BaseError(`TooltipExecutor: ${options[prop]} is illegal value for ${prop}`);
        }
    }
};

/**
 * Curates a tooltip with content and target element.
 * @param {Element} tooltip
 * @param {Element} target
 * @param {string} htmlContent
 */
exports.curateTooltip = function (tooltip, target, htmlContent) {
    if (!_.isNil(htmlContent)) {
        tooltip.querySelector(`[${exports.contentAttribute}]`).innerHTML = htmlContent;
    }
    let before = tooltip.querySelector(`[${_targetNextSiblingAttribute}]`);
    if (before) before.parentNode.insertBefore(target, before);
    let parent = tooltip.querySelector(`[${_targetParentAttribute}]`);
    if (parent) parent.appendChild(target);
    target.setAttribute(exports.targetAttribute, 'true');
};

/**
 * Removes a tooltip from target and inserts target before tooltip in the DOM.
 * @param {Element} target
 */
exports.detachTooltip = function (target) {
    if (!target.hasAttribute(exports.targetAttribute)) return;
    if (!target.parentNode) return;
    let tooltip = target.parentNode;
    while (tooltip && !tooltip.hasAttribute(exports.tooltipAttribute)) tooltip = tooltip.parentNode;
    if (_.isNil(tooltip) || !tooltip.hasAttribute(exports.tooltipAttribute)) return;
    tooltip.parentNode.insertBefore(target, tooltip);
    tooltip.parentNode.removeChild(tooltip);
    target.removeAttribute(exports.targetAttribute);
};

/**
 * @param {Element} tooltip
 * @returns {boolean} whether the tooltip is visible.
 */
exports.isVisible = function (tooltip) {
    let visibilityTarget = tooltip.querySelector(`[${_targetNextSiblingAttribute}]`);
    if (!visibilityTarget) {
        let targetParent = tooltip.querySelector(`[${_targetParentAttribute}]`);
        visibilityTarget =
            targetParent.nextElementSibling || targetParent.previousElementSibling;
    }
    return _.isVisible(visibilityTarget);
};

/**
 * Describes the tooltip states
 * @type {{string: string}}
 */
exports.State = Object.freeze({
                                  SHOW: 'SHOW',
                                  HIDE: 'HIDE'
                              });

/**
 * Name prefix for attributes, events and ids.
 * @type {string}
 */
exports.namePrefix = 'brainpal-' + Interface.name;

/**
 * @param {string|number} id
 * @returns {string} prefixes namePrefix to id, if it is not nil.
 */
exports.tooltipId = function (id) {
    return _.isNil(id) ? exports.namePrefix : `${exports.namePrefix}-${id.toString()}`;
};

/**
 * Marks tooltip containers.
 * @type {string}
 */
exports.tooltipAttribute = 'data-' + exports.namePrefix;

/**
 * Marks the element to which one should insert the tooltip content.
 * @type {string}
 */
exports.contentAttribute = exports.tooltipAttribute + '-content';

/**
 * Marks tooltip targets.
 * @type {string}
 */
exports.targetAttribute = exports.tooltipAttribute + '-target';

/**
 * Attaches a tooltip to an element
 * @param {Object} options
 * @returns {Element} the created tooltip.
 * @private
 */
function _attachTooltip(options) {
    const target = document.querySelector(options.target);
    exports.detachTooltip(target);
    let parent  = target.parentNode;
    let tooltip = _tooltipInfo[options.type].buildTypeTemplate(options);
    tooltip.setAttribute('id', exports.tooltipId(options.id));
    if (options.timer > 0) {
        tooltip.setAttribute(_timerAttribute, (options.timer).toString());
    }
    parent.insertBefore(tooltip, target);
    exports.curateTooltip(tooltip, target, options.htmlContent);
    _attachEvents(tooltip, options.id, options.toLog);
    return tooltip;
}

/**
 * Attaches 'show' and 'hide' events for a tooltip.
 * @param {Element} tooltip
 * @param {string|number} id
 * @param {boolean} toLog - whether to log state changes.
 */
function _attachEvents(tooltip, id, toLog) {
    _.on(Master.eventName(Interface.name), (ev) => {
        let state;
        if (state = _.get(ev, 'detail.state')) {
            if (exports.State[state]) {
                _changeState(tooltip, state, id, toLog);
            } else {
                throw new BaseError('TooltipExecutor: ' + state.toString() + ' is an illegal' +
                                    ' tooltip state.');
            }
        } else {
            state = tooltip.classList.contains(styles.show) ? exports.State.HIDE :
                    exports.State.SHOW;
            _changeState(tooltip, state, id, toLog);
        }
        if (tooltip.hasAttribute(_timerAttribute) && tooltip.classList.contains(styles.show)) {
            const timeToHide = Number.parseInt(tooltip.getAttribute(_timerAttribute));
            if (timeToHide <= 0) throw new BaseError('Tooltip: illegal timer');
            setTimeout(() => {
                _changeState(tooltip, exports.State.HIDE, id, toLog);
            }, timeToHide);
        }
    }, id);
}

/**
 * Changes that state of tooltip.
 * @param {Element} tooltip
 * @param {string} state
 * @param {string|number} id
 * @param {boolean} toLog - whether to log state changes.
 * @private
 */
function _changeState(tooltip, state, id, toLog) {
    if (state === exports.State.SHOW) {
        tooltip.classList.add(styles.show);
        if (toLog) _logStateChange(tooltip, state, id);
    } else {
        tooltip.classList.remove(styles.show);
        if (toLog) _logStateChange(tooltip, state, id);
    }
}

/**
 * Logs change in tooltip state
 * @param {Element} tooltip
 * @param {string} state
 * @param {string|number} id
 * @private
 */
function _logStateChange(tooltip, state, id) {
    if (tooltip.getAttribute(_logTimerIdAttribute)) {
        clearTimeout(Number.parseInt(tooltip.getAttribute(_logTimerIdAttribute)));
    }
    tooltip.setAttribute(_logTimerIdAttribute, setTimeout(() => {
        const isVisible = exports.isVisible(tooltip);
        if (state === exports.State.SHOW) {
            if (isVisible) {
                Logger.log(Level.INFO, `Tooltip (id = ${id}) exposed.`);
            } else {
                Logger.log(Level.WARNING, `Failed to expose tooltip (id = ${id}).`);
            }
        } else if (state === exports.State.HIDE) {
            if (!isVisible) {
                Logger.log(Level.INFO, `Tooltip (id = ${id}) is hidden.`);
            } else {
                Logger.log(Level.WARNING, `Failed to hide tooltip (id = ${id}).`);
            }
        }
        tooltip.removeAttribute(_logTimerIdAttribute);
        // 50 is used to let animation play.
    }, 50).toString());
}

//noinspection HtmlUnknownAttribute
const _svgComic = [
    `<svg viewBox='0 0 200 150' preserveAspectRatio='none'>
        <path id='path1' d='M184.112,144.325c0.704,2.461,3.412,4.016,5.905,3.611c2.526-0.318,4.746-2.509,4.841-5.093
        c0.153-2.315-1.483-4.54-3.703-5.155c-2.474-0.781-5.405,0.37-6.612,2.681c-0.657,1.181-0.845,2.619-0.442,3.917'/>
        <path id='path2' d='M159.599,137.909c0.975,3.397,4.717,5.548,8.161,4.988c3.489-0.443,6.558-3.466,6.685-7.043
        c0.217-3.19-1.805-6.34-5.113-7.118c-3.417-1.079-7.469,0.508-9.138,3.701c-0.91,1.636-1.166,3.624-0.612,5.414'/>
        <path id='path3' d='M130.646,125.253c1.368,4.656,6.393,7.288,10.806,6.718c4.763-0.451,9.26-4.276,9.71-9.394
        c0.369-3.779-1.902-7.583-5.244-9.144c-5.404-2.732-12.557-0.222-14.908,5.448c-0.841,1.945-1.018,4.214-0.388,6.294'/>
        <path id='path4' d='M49.933,13.549c10.577-20.192,35.342-7.693,37.057,1.708c3.187-5.687,8.381-10.144,14.943-12.148
        c10.427-3.185,21.37,0.699,28.159,8.982c15.606-3.76,31.369,4.398,35.804,18.915c3.269,10.699-0.488,21.956-8.71,29.388
        c0.395,0.934,0.762,1.882,1.064,2.873c4.73,15.485-3.992,31.889-19.473,36.617c-5.073,1.551-10.251,1.625-15.076,0.518
        c-3.58,10.605-12.407,19.55-24.386,23.211c-15.015,4.586-30.547-0.521-39.226-11.624c-2.861,1.991-6.077,3.564-9.583,4.636
        c-18.43,5.631-32.291,2.419-38.074-19.661c-2.645-10.096,3.606-18.51,3.606-18.51C2.336,71.24,1.132,49.635,16.519,42.394
        C-1.269,28.452,18.559,0.948,37.433,6.818C42.141,8.282,49.933,13.549,49.933,13.549z'/>
    </svg>`,
    `<svg viewBox='0 0 200 150' preserveAspectRatio='none'>
        <polygon points='29.857,3.324 171.111,3.324 196.75,37.671 184.334,107.653 104.355,136.679 100,146.676 96.292,136.355
        16.312,107.653 3.25,37.671'/>
    </svg>`];

/**
 * Like pokedex but for tooltips!
 * @type {{string, Object}}
 */
const _tooltipInfo = {
    bloated: {
        buildTypeTemplate: function (options) {
            let tooltip = _buildTemplate(options.type);
            tooltip.querySelector(`.${styles.content}`)
                   .setAttribute(_targetNextSiblingAttribute, 'true');
            tooltip.querySelector(`.${styles.content}`)
                   .setAttribute(exports.contentAttribute, 'true');
            return tooltip;
        }
    },
    line   : {
        buildTypeTemplate: function (options) {
            let tooltip = _buildTemplate(options.type);
            let text    = document.createElement('span');
            text.classList.add(styles[options.type], styles.text);
            let inner = document.createElement('span');
            inner.classList.add(styles[options.type], styles.inner);
            inner.setAttribute(exports.contentAttribute, 'true');
            text.appendChild(inner);
            let content = tooltip.querySelector(`.${styles.content}`);
            content.setAttribute(_targetNextSiblingAttribute, 'true');
            content.appendChild(text);
            return tooltip;
        }
    },
    sharp  : {
        direction        : ['left', 'right'],
        buildTypeTemplate: function (options) {
            // 0 is provided so that if (effectNum) yields false.
            let tooltip = _buildTemplate(options.type, 0, options.direction);
            let item    = document.createElement('span');
            item.classList.add(styles[options.type], styles.item);
            item.setAttribute(_targetParentAttribute, 'true');
            let content = tooltip.querySelector(`.${styles.content}`);
            content.setAttribute(exports.contentAttribute, 'true');
            tooltip.insertBefore(item, content);
            return tooltip;
        }
    },
    curved : {
        direction        : ['left', 'right'],
        buildTypeTemplate: function (options) {
            // 0 is provided so that if (effectNum) yields false.
            let tooltip = _buildTemplate(options.type, 0, options.direction);
            let item    = document.createElement('span');
            item.classList.add(styles[options.type], styles.item);
            item.setAttribute(_targetParentAttribute, 'true');
            let content = tooltip.querySelector(`.${styles.content}`);
            content.setAttribute(exports.contentAttribute, 'true');
            tooltip.insertBefore(item, content);
            return tooltip;
        }
    },
    round  : {
        effect           : [1, 2, 3, 4, 5],
        buildTypeTemplate: function (options) {
            let tooltip = _buildTemplate(options.type, options.effect);
            let content = tooltip.querySelector(`.${styles.content}`);
            content.setAttribute(exports.contentAttribute, 'true');
            content.setAttribute(_targetNextSiblingAttribute, 'true');
            return tooltip;
        }
    },
    comic  : {
        effect           : [1, 2],
        buildTypeTemplate: function (options) {
            let tooltip = _buildTemplate(options.type, options.effect);
            let content = tooltip.querySelector(`.${styles.content}`);
            content.setAttribute(exports.contentAttribute, 'true');
            content.setAttribute(_targetNextSiblingAttribute, 'true');
            let shape = document.createElement('div');
            shape.classList.add(styles[options.type], styles.shape);
            shape.innerHTML = _svgComic[options.effect];
            tooltip.appendChild(shape);
            return tooltip;
        }
    },
    box    : {
        effect           : [1, 2],
        buildTypeTemplate: function (options) {
            let tooltip = _buildTemplate(options.type, options.effect);
            let item    = document.createElement('span');
            item.classList.add(styles[options.type], styles.item);
            item.setAttribute(_targetParentAttribute, 'true');
            let content = tooltip.querySelector(`.${styles.content}`);
            let text    = document.createElement('span');
            text.classList.add(styles[options.type], styles.text);
            text.setAttribute(exports.contentAttribute, 'true');
            content.appendChild(text);
            tooltip.insertBefore(item, content);
            return tooltip;
        }
    },
    classic: {
        effect           : [1, 2],
        buildTypeTemplate: function (options) {
            let tooltip = _buildTemplate(options.type, options.effect);
            let item    = document.createElement('span');
            item.classList.add(styles[options.type], styles.item);
            item.setAttribute(_targetParentAttribute, 'true');
            let content = tooltip.querySelector(`.${styles.content}`);
            let text    = document.createElement('span');
            text.classList.add(styles[options.type], styles.text);
            text.setAttribute(exports.contentAttribute, 'true');
            content.appendChild(text);
            tooltip.insertBefore(item, content);
            return tooltip;
        }
    }
};

/**
 * @param {string} type - type name, i.e. `cureved`
 * @param {number} [effectNum] - to append the animation class.
 * @param {string} [direction] - declares where should the tooltip appear
 * @returns {Element} build a span that encapsulates the tooltip.
 * @private
 */
function _buildTemplate(type, effectNum, direction) {
    let tooltip = document.createElement('span'),
        content = document.createElement('span');
    tooltip.classList.add(styles[type]);
    tooltip.setAttribute(exports.tooltipAttribute, 'true');
    content.classList.add(styles[type], styles.content);
    tooltip.appendChild(content);
    if (effectNum) tooltip.classList.add(styles[`effect-${effectNum}`]);
    if (direction) tooltip.classList.add(styles[direction]);
    return tooltip;
}

/**
 * Indicates whether the style was loaded to the DOM.
 * @type {boolean}
 * @private
 */
let _styleLoaded = false;

/**
 * Time in ms to hide the tooltip in.
 * @type {string}
 * @private
 */
const _timerAttribute = exports.tooltipAttribute + '-timer';

/**
 * ID of logging timer.
 * @type {string}
 * @private
 */
const _logTimerIdAttribute = exports.tooltipAttribute + '-log-timer-id';

/**
 * Marks the element to which one should append the tooltip's target.
 * @type {string}
 * @private
 */
const _targetParentAttribute = exports.targetAttribute + '-parent';

/**
 * Marks the element to which one should append the tooltip's target.
 * @type {string}
 * @private
 */
const _targetNextSiblingAttribute = exports.targetAttribute + '-next-sibling';
