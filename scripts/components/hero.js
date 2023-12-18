class Hero {
    constructor() {
        this.scrollTrigger = document.querySelectorAll('[data-scroll-trigger]');
        this.header = document.querySelector('.c-header');
    }

    init() {
        this.event();
    }

    event() {
        const _self = this;

        Array.prototype.forEach.call(_self.scrollTrigger, (trigger) => {
            let additionalScroll = -_self.header.offsetHeight * 1.5;

            trigger.addEventListener('click', (e) => {
                if (e.currentTarget.hash && document.querySelector(e.currentTarget.hash)) {
                    e.preventDefault();

                    _self.scrollPageTo( e.currentTarget.hash, 1000, additionalScroll)
                }
            });
        });
    }

    scrollPageTo (to, duration, additionalScroll = 0) {
        //t = current time
        //b = start value
        //c = change in value
        //d = duration
        const easeInOutQuad = function (t, b, c, d) {
            t /= d/2;
            if (t < 1) return c/2*t*t + b;
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        };

        return new Promise((resolve, reject) => {
            const element = document.scrollingElement;

            if (typeof to === 'string') {
                to = document.querySelector(to) || reject();
            }
            if (typeof to !== 'number') {
                to = to.getBoundingClientRect().top + element.scrollTop + additionalScroll;
            }

            let start = element.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;

            const animateScroll = function() {
                currentTime += increment;
                let val = easeInOutQuad(currentTime, start, change, duration);
                element.scrollTop = val;
                if(currentTime < duration) {
                    setTimeout(animateScroll, increment);
                } else {
                    resolve();
                }
            };
            animateScroll();
        });
    }
}

new Hero().init();



