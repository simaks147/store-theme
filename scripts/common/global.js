window.$ = jQuery;

class Global {
    constructor() {
        this.woocommerceForm = $('.woocommerce-page form');
        this.timer = 0;
        this.defaultDocumentWidth = 1366;
        this.defaultDocumentHeight = 768;
        this.actualDocumentWidth = null;
        this.actualDocumentHeight = null;
        this.defaultBeensAmount = 6;
        this.imagesPath = window.location.origin + '/wp-content/themes/theme/dist/images/';
        this.minBeanWidth = 100;
        this.maxBeanWidth = 230;
        this.beensSrc = [
            this.imagesPath + 'bean1.svg',
            this.imagesPath + 'bean2.svg',
            this.imagesPath + 'bean3.svg',
        ];
        // this.beensAnimation = [
        //     'float-bean1',
        //     'float-bean2',
        //     'float-bean3',
        //     'float-bean4',
        // ];
        this.beansContainer = null;
        this.beensAnimation = {
            name: [
                'float-bean1',
                'float-bean2',
                'float-bean3',
                'float-bean4',
            ],
            direction: [
                'normal',
                'alternate',
                'reverse',
                'alternate-reverse',
            ],
            timingFunction: [
                'ease',
                'ease-in',
                'ease-out',
                'ease-in-out',
                'linear',
            ],
        };
    }

    init() {
        this.event();
        // this.addCustomScriptFunction();
        this.convertImgToSvg('img')
    }

    event() {
        const _self = this;

        window.addEventListener('load', () => {
            // waypoints.js script
            window.addCustomScript({
                src: 'https://cdn.jsdelivr.net/npm/waypoints@4.0.1/lib/noframework.waypoints.min.js',
            }, () => {
                setTimeout(() => {
                    // document.body.classList.add('js-loaded');

                    _self.waypointsInit();
                }, 200);
            });


            _self.woocommerceFormStyles();
        });

        window.addEventListener('DOMContentLoaded', () => {

        });

        window.addEventListener('resize', () => {
            _self.stopTransition();

            _self.backgroundInit();
        });

        window.addEventListener('scroll', () => {
            if (window.pageYOffset !== 0) {
                document.body.classList.add('js-header-fixed');
            }
            else {
                document.body.classList.remove('js-header-fixed');
            }
        });
    }


    woocommerceFormStyles() {
        const _self = this;

        $('.form-row').each((i, el) => {
            if ($(el).find('input').val() !== '') {
                $(el).addClass('js-active');
            }
        });

        _self.woocommerceForm
            .on('focusin', '.input-text', function (e) {
                $(e.currentTarget).closest('.form-row').addClass('js-active');
            })
            .on('focusout', '.input-text', function (e) {
                setTimeout(() => {
                    if ($(e.currentTarget).val() === '') {
                        $(e.currentTarget).closest('.form-row').removeClass('js-active');
                    }
                });
            });


        if (document.body.classList.contains('single-product')) {
            // selectize.js script
            window.addCustomScript({
                src: 'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/js/standalone/selectize.min.js',
            }, () => {
                $('#pa_size').selectize({
                    hideSelected: false,
                    closeAfterSelect: true,
                    maxItems: 1,
                    allowEmptyOption: true,
                });
            });
        }

        $('body').on('updated_wc_div checkout_error', function () {
            setTimeout(function () {
                let event = document.createEvent('Event');
                event.initEvent('resize', true, true);
                window.dispatchEvent(event);

                window.scrollTo(0, 0);
            }, 2000);
        });
    }


    convertImgToSvg(query, callback) {
        const images = document.querySelectorAll(query);

        images.forEach(image => {
            if (image.src.split('.').pop() === 'svg') {
                fetch(image.src)
                    .then(res => res.text())
                    .then(data => {
                        const parser = new DOMParser();
                        const svg = parser.parseFromString(data, 'image/svg+xml').querySelector('svg');

                        if (image.id) svg.id = image.id;
                        if (image.className) svg.classList = image.classList;

                        image.parentNode.replaceChild(svg, image);
                    })
                    .then(callback)
                    .catch(error => console.error(error))
            }
        });
    }


    // addCustomScriptFunction() {
    //     window.addCustomScript = function (attributes, callback) {
    //         const s = document.createElement('script');
    //
    //         for (let attr in attributes) {
    //             s.setAttribute(attr, attributes[attr])
    //         }
    //         s.onload = callback;
    //         document.body.appendChild(s);
    //     };
    // }


    waypointsInit() {
        document.querySelectorAll('[data-waypoint]').forEach((element) => {

            let wp = new window.Waypoint({
                element,
                handler: function () {
                    setTimeout(() => element.classList.add('js-in'), 0);

                    wp.destroy();
                },
                offset: '95%',
            });
        });
    }


    stopTransition() {
        const _self = this;

        if (_self.timer) {
            clearTimeout(_self.timer);
            _self.timer = null;
        }
        else {
            document.body.classList.add('js-stop-transitions');
        }

        _self.timer = setTimeout(() => {
            document.body.classList.remove('js-stop-transitions');
            _self.timer = null;
        }, 100);
    }


    /*
    Beans background
     */
    backgroundInit() {
        const _self = this;

        if (_self.beansContainer) {
            _self.beansContainer.remove();
        }

        _self.beansContainer = document.createElement('div');
        _self.beansContainer.className = 'c-beans';

        _self.appendBeans();

        document.body.appendChild(_self.beansContainer);
    }

    calculateBeansAmount() {
        const _self = this;

        _self.actualDocumentWidth = Math.max(
            document.body.scrollWidth, document.documentElement.scrollWidth,
            document.body.offsetWidth, document.documentElement.offsetWidth,
            document.body.clientWidth, document.documentElement.clientWidth
        );

        _self.actualDocumentHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        const widthCoef = Math.ceil(Math.max(_self.actualDocumentWidth / _self.defaultDocumentWidth, 1));

        const heightCoef = Math.ceil(Math.max(_self.actualDocumentHeight / _self.defaultDocumentHeight, 1));

        const actualBeensAmount = widthCoef * heightCoef * _self.defaultBeensAmount;

        return actualBeensAmount;
    }

    appendBeans() {
        const _self = this;
        let bean,
            left = 0,
            prevLeft = 0,
            top = 0,
            prevTop = 0;

        for (let i = 0; i < _self.calculateBeansAmount(); i++) {
            bean = _self.createBean();

            if (left === 0 || left < 0) {
                left = _self.getRandomIntInclusive(200, 300);
                if (top === 0) {
                    top = prevTop + _self.getRandomIntInclusive(0, 200);
                }
                else {
                    top = prevTop + _self.getRandomIntInclusive(-bean.width, 400);
                }
            }
            else if (left > (_self.actualDocumentWidth - 200)) {
                left = _self.getRandomIntInclusive(-bean.width, 200);
                top = prevTop + _self.getRandomIntInclusive(400, 600);

                prevLeft = 0;
                prevTop = top;
            }
            else {
                left = prevLeft + _self.getRandomIntInclusive(500, 800);
                top = prevTop + _self.getRandomIntInclusive(-bean.width, 200);

                prevLeft = left;
            }


            // if ( top < ( _self.actualDocumentHeight + document.querySelector('.c-footer').clientHeight ) ) {
            bean.style.left = left + 'px';
            bean.style.top = top + 'px';
            bean.style.opacity = 0;
            // bean.style.transitionDuration = '5s';
            // bean.style.transitionProperty = 'opacity';

            _self.beansContainer.appendChild(bean);

            // }
        }
    }

    createBean() {
        const _self = this,
            bean = document.createElement('img');

        bean.src = _self.beensSrc[_self.getRandomIntInclusive(0, _self.beensSrc.length - 1)];
        bean.width = _self.getRandomIntInclusive(_self.minBeanWidth, _self.maxBeanWidth);
        bean.className = 'c-bean';
        bean.style.animationName = _self.beensAnimation.name[_self.getRandomIntInclusive(0, _self.beensAnimation.name.length - 1)];
        bean.style.animationDirection = _self.beensAnimation.direction[_self.getRandomIntInclusive(0, _self.beensAnimation.direction.length - 1)];
        bean.style.animationTimingFunction = _self.beensAnimation.timingFunction[_self.getRandomIntInclusive(0, _self.beensAnimation.timingFunction.length - 1)];
        bean.style.animationDuration = _self.getRandomIntInclusive(90, 120) + 's';
        bean.style.animationDelay = _self.getRandomIntInclusive(-50, 0) + 's';

        bean.addEventListener('load', () => {
            setTimeout(() => bean.classList.add('js-bean-loaded'), 100);
        });

        return bean;
    }

    getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }
}

new Global().init();







