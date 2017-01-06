/**
 * Proudly created by ohad on 01/01/2017.
 */
const galleryId         = require('../../client/manipulation/execute/media/gallery').idPrefix,
      _                 = require('../../client/common/util/wrapper'),
      idleEventName     = require('../../client/common/events/idle').name(),
      modalEventName    = require('../../client/manipulation/execute/interface/sweetalert')
          .eventName(),
      alertifyEventName = require('../../client/manipulation/execute/interface/alertify')
          .eventName();
module.exports          = {
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
                                            padding-top: 10px; }
                                         #daydeal #header h1 img{display: block; padding-top: 10px }
                                        #daydeal #content {
                                            padding-top: 0 !important;
                                            margin-top: 0; }
                                        #daydeal .container {padding: 0}
                                        #daydeal .hotel_phone {
                                            width: 70%; padding: 5px; margin-top: 10px;
                                            border-radius: 10px;
                                            margin-right: 15%; margin-left: 15%}
                                        #daydeal #content .group_sale_info .TotalRating {
                                            width: 70%; padding: 5px;
                                            margin-right: 15%; margin-left: 15%}
                                        #daydeal #content div.hotel_deal h2 {
                                            width:100%; height: 85px; font-size:28px; padding: 0}
                                        #daydeal #content #${galleryId} ul {
                                            padding: 0; width: 100%}
                                        #daydeal #content div#${galleryId} {height: 320px}
                                        #daydeal #content .percent {z-index: 1001}
                                        #daydeal #content .comments_deal_text {z-index: 1001}
                                        #daydeal #content .group_sale_image {width: 65%}
                                        #daydeal #content form {width: 65%; float: left}
                                        #daydeal #content input.button_res {width: 98%}
                                        #daydeal #content .reserve {width: 100%}
                                        #daydeal #content div#other_dates_by_res {width: 90%}
                                        #daydeal #content button#ToggleResCompo {padding: 0 0 0 10px}
                                        #daydeal #content .hotel_deal div:nth-child(5) {display: none}
                                        #daydeal #content .comments_deal_text {z-index: 1001}
                                        [class^='swal2'] h2 {
                                            background: none; width: auto; border: none}
                                        [class^='swal2'] { direction: rtl}
                                        [class^='ajs'] { direction: rtl}
                                        .alertify-notifier.ajs-left .ajs-message.ajs-visible { 
                                            border-radius: 10px; border: 1px solid #ccc;
                                            background: rgba(251, 201, 127, 0.96)}
                                        .ajs-title {font-size: 18px}
                                        .ajs-review div.deals_in {margin: 0; float: none; 
                                            width: 90%; padding: 0; color: #339; 
                                            background: none}
                                        .ajs-review div.deals_in div.TotalRating {float: none; 
                                            width: auto; margin: 5px 0 5px 15px; color: #0e4d8d;}
                                        @media (min-width: 1025px) {
                                            .alertify-notifier.ajs-left .ajs-message.ajs-visible {
                                                right: 290px !important; }
                                        }
                                        #daydeal #content #${galleryId} li {display: block}`
                                }
                            },
                            {
                                name     : 'remove',
                                selectors: ['#content .share', '#content>br',
                                            '#content div.address', '.comments_deal_text']
                            },
                            {
                                name     : 'move',
                                selectors: '#content h1:first-child',
                                options  : {nextSiblingSelector: '#menu'}
                            },
                            {
                                name     : 'move',
                                selectors: '#other_dates_by_res',
                                options  : {parentSelector: 'div.more_option div.date'}
                            },
                            {
                                name     : 'move',
                                selectors: '#content .hotel_phone',
                                options  : {parentSelector: '.group_sale_info'}
                            },
                            {
                                name     : 'move',
                                selectors: '.TotalRating:first-of-type',
                                options  : {parentSelector: '.group_sale_info', copy: true}
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
                            },
                            {
                                name   : 'typer',
                                options: {
                                    typerFn: function (typer) {
                                        document.querySelector('.hotel_deal h2').textContent = '';
                                        _.defer(function () {
                                            typer('.hotel_deal h2', 40)
                                                .cursor({blink: 'soft'})
                                                .line('מבצע סופ"ש 2 לילות במלון דיוויד ים המלח!!',
                                                      25)
                                                .pause(500)
                                                .emit('brainpal-title-1')
                                                .listen('brainpal-price-1')
                                                .continue(' מחיר טוב לא?')
                                                .pause(1500)
                                                .continue(' לא מספיק!')
                                                .pause(500)
                                                .emit('brainpal-title-2')
                                                .listen('brainpal-price-done')
                                                .back(23, 10)
                                                .continue(' רק 473 ש״ח לאדם בחדר דלוקס. ')
                                                .continue('וכמעט שכחנו... ')
                                                .pause(1000)
                                                .continue(' הופעה של טוביה צפיר!')
                                                .emit('brainpal-title-done')
                                                .pause(200)
                                                .end();
                                        });
                                        _.defer(function () {
                                            document.querySelector('#PriceView').textContent =
                                                '';
                                            document.querySelector('#PriceView').style.color =
                                                'red';
                                            typer('#PriceView').listen('brainpal-title-1')
                                                               .cursor({blink: 'soft'})
                                                               .line('₪2499')
                                                               .emit('brainpal-price-1')
                                                               .listen('brainpal-title-2')
                                                               .back(10, 10).run(function (elem) {
                                                elem.style.color =
                                                    '';
                                            }).pause(500).continue('₪1890').pause(1500)
                                                               .emit('brainpal-price-done').end();
                                        });
                                    }
                                }
                            },
                            {
                                name   : 'swal',
                                options: {
                                    modalFn: function (swal) {
                                        swal({
                                                 title             : 'עדיין מתלבט..',
                                                 type              : 'info',
                                                 text              : 'נציג שלנו ישמח לדבר איתך',
                                                 timer             : 10000,
                                                 confirmButtonColor: '#fbc97f',
                                                 showCloseButton   : true,
                                                 confirmButtonText : 'חייג עכשיו'
                                             });
                                    }
                                }
                            },
                            {
                                name   : 'alertify',
                                options: {
                                    alertifyFn: function (alertify) {
                                        alertify.set('notifier', 'position', 'bottom-left');
                                        alertify.notify('מה אומרים על המלון הזה', 'title', 200);
                                        _.delay(() => {
                                            alertify.notify(_reviewToAlertify(0), 'review', 200);
                                        }, 1000);
                                        _.delay(() => {
                                            alertify.notify('וזו לא הביקורת היחידה', 'title', 200);
                                        }, 2000);
                                        _.delay(() => {
                                            alertify.notify(_reviewToAlertify(1), 'review', 200);
                                        }, 2500);
                                        _.delay(() => {
                                            alertify.notify('ויש יותר ממאה כאלו...', 'title', 200);
                                        }, 3500);
                                        _.delay(() => {
                                            alertify.dismissAll();
                                            document.dispatchEvent(
                                                new CustomEvent('brainpal-alertify-dismiss'));
                                        }, 8500);
                                    },
                                    rtl       : true
                                }
                            },
                            {
                                name   : 'event',
                                options: {
                                    listen: {event: 'brainpal-title-done', selector: 'body'},
                                    create: {
                                        event  : 'idle',
                                        options: {
                                            waitTime: 10000,
                                            detail  : {id: 'reviews'}
                                        }
                                    }
                                }
                            },
                            {
                                name   : 'event',
                                options: {
                                    listen : {event: idleEventName, detail: {id: 'reviews'}},
                                    trigger: {
                                        event: alertifyEventName
                                    }
                                }
                            },
                            {
                                name   : 'event',
                                options: {
                                    listen: {event: 'brainpal-alertify-dismiss'},
                                    create: {
                                        event  : 'idle',
                                        options: {
                                            waitTime: 10000,
                                            detail  : {id: 'modal'}
                                        }
                                    }
                                }
                            },
                            {
                                name   : 'event',
                                options: {
                                    listen : {event: idleEventName, detail: {id: 'modal'}},
                                    trigger: {
                                        event: modalEventName
                                    }
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

function _reviewToAlertify(index) {
    let content = document.querySelectorAll('.deals_in').item(index).cloneNode(true);
    let rating  = document.querySelector(
        `.TotalRating:nth-of-type(${index + 2})`).childNodes[0].textContent.trim();
    let wrapper = document.createElement('div');
    wrapper.classList.add('TotalRating');
    wrapper.textContent = rating;
    content.appendChild(wrapper);
    return content;
}