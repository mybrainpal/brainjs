/**
 * Proudly created by ohad on 29/12/2016.
 *
 * An event that's fired after the user had been idle.
 */
class IdleEvent {
    name = 'brainpal-idle';

    /**
     * @param {Object} options
     *  @property {number} [time]
     *  @property {boolean} [fireOnce]
     */
    constructor(options) {
        if (_.has(options, 'time')) {
            this.time = options.time;
        } else {
            new TypeError('IdleEvent: missing time');
        }

    }

}