class Hero {
    constructor() {
        this.steps = document.querySelectorAll('.c-steps');
        this.initialItemHeight = '164px';
        this.activeClass = 'js-step-active';
    }

    init() {
        this.event();
    }

    event() {
        const _self = this;

        Array.prototype.forEach.call(_self.steps, (block) => {
            let stepsItems = block.querySelectorAll('.c-steps__item'),
                activeItem = false;

            Array.prototype.forEach.call(stepsItems, (item) => {
                _self.defineRealItemHeight(item);

                window.addEventListener('resize', () => _self.defineRealItemHeight(item));

                item.style.height = _self.initialItemHeight;

                item.addEventListener('click', (e) => {
                    let trigger = e.target.closest('.c-steps__item-trigger'),
                        title = e.target.closest('.c-steps__item-title');

                    if (trigger || title) {
                        if ( activeItem && (activeItem !== item) ) {
                            activeItem.classList.remove(_self.activeClass);
                            activeItem.style.height = _self.initialItemHeight;
                        }

                        if ( item.classList.contains(_self.activeClass) ) {
                            item.classList.remove(_self.activeClass);
                            item.style.height = _self.initialItemHeight;
                        }
                        else {
                            item.classList.add(_self.activeClass);
                            item.style.height = 'auto';
                            item.style.height = item.dataset.height;
                        }

                        activeItem = item;
                    }
                });
            });
        });
    }

    defineRealItemHeight(item) {
        const _self = this;

        item.classList.remove(_self.activeClass);
        item.style.height = 'auto';
        item.dataset.height = `${item.offsetHeight}px`;
        item.style.height = _self.initialItemHeight;
    }
}

new Hero().init();



