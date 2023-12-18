class HeroHome {
    constructor() {
        this.slider1 = document.querySelector('.c-hero-home__slider');
        this.slider2 = document.querySelector('.c-hero-home__content');
    }

    init() {
        this.addScripts();
    }

    addScripts() {
        const _self = this;

        // swiper.js script
        if ( this.slider1 ) {
            window.addCustomScript({
                src: 'https://unpkg.com/swiper/swiper-bundle.min.js',
            }, () => {
                let swiperContainer1 = _self.slider1.querySelector('.swiper-container'),
                    swiperContainer2 = _self.slider2.querySelector('.swiper-container'),
                    autoplayDelay = _self.slider1.dataset.autoplayDelay,
                    autoplay = autoplayDelay ? { delay: parseInt(autoplayDelay)*1000 } : false;

                let mySwiper2 =  new window.Swiper (swiperContainer2, {
                    slidesPerView: 1,
                    loop: true,
                    allowTouchMove: false,
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true,
                    },
                });

                new window.Swiper (swiperContainer1, {
                    slidesPerView: 1,
                    loop: true,
                    speed: 1000,
                    pagination: {
                        el: '.c-hero-home__content .swiper-pagination',
                        type: 'bullets',
                        clickable: true,
                    },
                    autoplay,
                    controller: {
                        control: mySwiper2,
                        by: 'container',
                    },
                });
            });
        }
    }
}

new HeroHome().init();
