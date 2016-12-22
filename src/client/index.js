/**
 * Proudly created by ohad on 02/12/2016.
 */
var Client       = require('./common/client'),
    Logger       = require('./common/log/logger'),
    Level        = require('./common/log/logger').Level,
    Storage      = require('./common/storage/storage'),
    Collector    = require('./collection/collector'),
    Manipulator  = require('./manipulation/manipulator'),
    Experiment   = require('./manipulation/experiment/experiment'),
    BPReadyEvent = require('./common/events/brainpal-ready');

//noinspection JSUnusedLocalSymbols
window.BrainPal = (function (window, undefined) {
    var readyEvent, customerConfiguration, options;
    var brainPal = window.BrainPal || {};
    if (!Client.canRunBrainPal()) {
        Logger.log(Level.ERROR, 'Seems like this browser and BrainPal ain\'t gonna be friends :-(');
        return;
    }

    /**
     * Plays the whole thing.
     * @param {Object} customerConfiguration
     *  @property {Object[]} [collect] - anchors and subjects to collect data about.
     *      @property {Object} [subjectOptions] - see {@link Collector#collect}
     *  @property {Object[]} [experiments] - experiments to execute.
     *      @property {Object} experiment
     *      @property {Object} options
     *          @property {Object[]} anchors
     *  @property {string} storage
     */
    function play(customerConfiguration) {
        var anchors;
        var j;
        var i;
        Logger.log(Level.INFO, 'BrainPal: game on!');
        Client.init();
        if (customerConfiguration.hasOwnProperty('collect')) {
            for (i = 0; i < customerConfiguration.collect.length; i++) {
                Collector.collect(customerConfiguration.collect[i]);
            }
        }
        if (customerConfiguration.hasOwnProperty('experiments')) {
            for (j = 0; j < customerConfiguration.experiments.length; j++) {
                Manipulator.experiment(
                    new Experiment(customerConfiguration.experiments[j].experiment),
                    customerConfiguration.experiments[j].options);
            }
        }
    }

    customerConfiguration = {
        storage    : {
            name: 'google-analytics'
        },
        experiments: [
            {
                experiment: {
                    id    : 1,
                    label : 'sort featured',
                    groups: [
                        {
                            label       : 'sorted',
                            demographics: {
                                properties: [
                                    {
                                        name: 'os',
                                        os  : 'mac'
                                    }
                                ]
                            },
                            executors   : [
                                {
                                    name     : 'sort',
                                    selectors: 'div.tabs1>ul.center_softlist>li',
                                    specs    : {selector: 'span.count', order: 'desc'}
                                }
                            ]
                        }
                    ]
                },
                options   : {
                    subjectOptions: {
                        dataProps   : [
                            {
                                name    : 'downloadCount',
                                selector: 'span.count'
                            },
                            {
                                name    : 'appName',
                                selector: 'a.title-soft'
                            }
                        ],
                        anchor      : {
                            selector: 'div.list-text',
                            event   : 'click'
                        },
                        iterSelector: 'div.tabs1>ul.center_softlist>li'
                    }
                }
            },
            {
                experiment: {
                    id    : 2,
                    label : 'search bar focus',
                    groups: [
                        {
                            label       : 'focus',
                            demographics: {
                                properties: [
                                    {
                                        name: 'os',
                                        os  : 'mac'
                                    }
                                ]
                            },
                            executors   : [
                                {
                                    name     : 'form',
                                    selectors: '#ybsb-box',
                                    specs    : {focus: true}
                                }
                            ]
                        }
                    ]
                },
                options   : {
                    subjectOptions: {
                        anchor: {
                            selector: '#ybsb-box',
                            event   : 'keyup'
                        }
                    }
                }
            }
        ]
    };

    if (customerConfiguration.hasOwnProperty('storage')) {
        if (customerConfiguration.storage.hasOwnProperty('name')) {
            options = {};
            if (customerConfiguration.storage.hasOwnProperty('options')) {
                options = customerConfiguration.storage.options;
            }
            options.onReadyHandler = function () {
                Logger.options({storage: customerConfiguration.storage.name});
                Collector.options({storage: customerConfiguration.storage.name});
            };
            Storage.create(customerConfiguration.storage.name, options);
        }
    } else {
        Logger.log(Level.WARNING, 'customerConfiguration: missing storage.');
        return;
    }
    readyEvent = new BPReadyEvent();
    // Let the games begin.
    window.addEventListener(readyEvent.eventName, function () { play(customerConfiguration); });

    return brainPal;
})(window);
