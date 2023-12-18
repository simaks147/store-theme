class Header {
    constructor() {
        // this.header = document.querySelector('.c-header__sec');
        // this.viewportHeight = null;
        this.mobile = null;
        // this.menuItemTrigger = null;
        this.menuItems = document.querySelectorAll('.c-header__nav .menu-item');
        this.slider = document.querySelector('.c-header__sec-inner .swiper-container');
    }

    init() {
        this.event();
        this.addScripts();

        // if (this.mobile) {
        //     this.itemTriggerAppend();
        // }
    }

    addScripts() {
        const _self = this;


        // swiper.js script
        if ( !document.body.classList.contains('hidden-top-panel') ) {
            window.addCustomScript({
                src: 'https://unpkg.com/swiper/swiper-bundle.min.js',
            }, () => {
                new window.Swiper (_self.slider, {
                    slidesPerView: 1,
                    loop: true,
                    autoHeight: true,
                    allowTouchMove: false,
                    navigation: {
                        nextEl: '.c-header__sec-slider-next',
                        prevEl: '.c-header__sec-slider-prev',
                    },
                    // speed: 1000,

                });
            });
        }
    }

    event() {
        const _self = this;

        _self.addHoverEffect();

        window.addEventListener('resize', () => {
            // _self.viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            //
            // _self.header.style.height = `${_self.viewportHeight}px`;

            // define mobile or desktop
            if (window.innerWidth < 768) {
                if (_self.mobile === false || _self.mobile === null) {
                    _self.mobile = true;

                    _self.itemTriggerAppend();
                }

            } else {
                if (_self.mobile === true || _self.mobile === null) {
                    _self.mobile = false;

                    _self.itemTriggerRemove();

                    document.body.classList.remove('js-menu-active');

                    Array.prototype.forEach.call(_self.menuItems, (item) => item.classList.remove('js-menu-item-active', 'js-menu-item-not-active'));
                }
            }

        });

        window.dispatchEvent( new Event('resize') );
    }

    addHoverEffect() {
        const _self = this,
            activeClass = 'js-menu-item-active',
            notActiveClass = 'js-menu-item-not-active';

        Array.prototype.forEach.call(_self.menuItems, (item) => {
            let itemSiblings = Array.prototype.filter.call(item.parentNode.children, function(child){
                return child !== item;
            });

            item.addEventListener('mouseover', function () {
                if (window.innerWidth >= 768) {
                    item.classList.add(activeClass);
                    item.classList.remove(notActiveClass);

                    Array.prototype.forEach.call(itemSiblings, (sibling) => {
                        sibling.classList.add(notActiveClass);
                        sibling.classList.remove(activeClass);
                    });
                }
            });

            item.addEventListener('mouseout', function () {
                if (window.innerWidth >= 768) {
                    Array.prototype.forEach.call(item.parentNode.children, function(child){
                        child.classList.remove(activeClass);
                        child.classList.remove(notActiveClass);
                    });
                }
            });
        });
    }

    itemTriggerAppend() {
        const _self = this,
            activeClass = 'js-menu-item-active',
            notActiveClass = 'js-menu-item-not-active';

        Array.prototype.forEach.call(_self.menuItems, (item) => {
            let subMenu =  item.querySelector('.sub-menu');

            if (item.contains(subMenu)) {
                let menuItemTrigger = document.createElement('div');

                menuItemTrigger.classList.add('menu-item-trigger');

                menuItemTrigger.style.left = `${item.offsetWidth + 50}px`;

                menuItemTrigger.addEventListener('click',() => {
                    // item.classList.toggle('js-menu-item-active');
                    item.classList.remove(notActiveClass);

                    if (item.classList.contains(activeClass)) {
                        item.classList.remove(activeClass);
                        document.body.classList.remove('js-sub-menu-open');
                    }
                    else {
                        item.classList.add(activeClass);
                        document.body.classList.add('js-sub-menu-open');
                    }

                    Array.prototype.forEach.call(item.parentNode.children, (itemSibling) => {
                        if (itemSibling !== item) {
                            itemSibling.classList.remove(activeClass);

                            if (item.classList.contains(activeClass)) {
                                itemSibling.classList.add(notActiveClass);
                            }
                            else {
                                itemSibling.classList.remove(notActiveClass);
                            }
                        }
                    });
                });

                item.appendChild(menuItemTrigger);

                subMenu.style.position = 'relative';
            }
        });

        // _self.menuItemTrigger = document.querySelectorAll('.menu-item-trigger');
    }

    itemTriggerRemove() {
        Array.prototype.forEach.call(document.querySelectorAll('.menu-item-trigger'), (trigger) => trigger.remove());
    }
}

new Header().init();
