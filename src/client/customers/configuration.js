/**
 * Proudly created by ohad on 01/01/2017.
 */
const galleryId = require('../manipulation/execute/media/gallery').idPrefix;
module.exports  = {
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
                                options  : {parentSelector: 'ul.bg_blue'}
                            },
                            {
                                name   : 'style',
                                options: {
                                    cssText: `
                                        #daydeal #menu li:last-child{float:left; padding: 0;}
                                        #daydeal #menu .formsearch{padding: 0; width: 100%}
                                        #daydeal #menu .fieldHolder{
                                            position: relative;
                                            margin: 0;
                                            background-color: #fff;
                                            width: 83% }
                                        #daydeal #header .hotels_info {padding-top: 5px}
                                        #daydeal #header h1{
                                            border: none;
                                            background: none;
                                            font-size: 32px;
                                            width: auto;
                                            padding-top: 20px; }
                                        #daydeal #content {
                                            padding-top: 0 !important;
                                            margin-top: 0; }
                                        #daydeal .container {padding: 0}
                                        #daydeal .hotel_phone {
                                            width: 70%;
                                            padding: 5px;
                                            margin: 10px 0 0 40px}
                                        #daydeal #content div.hotel_deal h2 {
                                            width:100%;
                                            padding: 0}
                                        #daydeal #content #${galleryId} ul {
                                            padding: 0;
                                            width: 100%}
                                        #daydeal #content div#${galleryId} {height: 300px}
                                        #daydeal #content .percent {z-index: 1001}
                                        #daydeal #content .comments_deal_text {z-index: 1001}
                                        #daydeal #content #${galleryId} li {display: block}`
                                }
                            },
                            {
                                name     : 'remove',
                                selectors: ['#content .share', '#content>br',
                                            '#content div.address']
                            },
                            {
                                name     : 'move',
                                selectors: '#content h1:first-child',
                                options  : {nextSiblingSelector: '#menu'}
                            },
                            {
                                name     : 'move',
                                selectors: '#content .hotel_phone',
                                options  : {parentSelector: '.group_sale_info'}
                            },
                            {
                                name     : 'gallery',
                                selectors: '.group_sale_image',
                                options  : {
                                    sourceSelectors: ['.group_sale_image>img', '#gallery img'],
                                    animationClass : 'fxSoftPulse'
                                }
                            },
                            {
                                name     : 'remove',
                                selectors: ['.group_sale_image>img']
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