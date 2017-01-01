/**
 * Proudly created by ohad on 01/01/2017.
 */
const customClass = require('../manipulation/execute/dom/style').defaultCustomClass;
module.exports    = {
    storage    : {
        name: 'local'
    },
    experiments: [
        {
            experiment: {
                id    : 1,
                label : 'magic',
                groups: [
                    {
                        label    : 'single',
                        executors: [
                            {
                                name     : 'move',
                                selectors: '.formsearch',
                                options  : {parentSelector: '#menu'}
                            },
                            {
                                name   : 'style',
                                options: {
                                    selector: '.formsearch',
                                    cssText : `.${customClass}{float:left; padding: 0 0 30px}`
                                }
                            }
                        ]
                    }
                ]
            },
            options   : {
                subjectOptions: {
                    dataProps: [
                        {
                            name    : 'price',
                            selector: '#PriceView'
                        },
                    ],
                    anchor   : {
                        selector: '.button_res',
                        event   : 'click'
                    }
                }
            }
        }
    ]
};