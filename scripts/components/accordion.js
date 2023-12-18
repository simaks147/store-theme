class Accordion {
    constructor() {
        this.accordion = document.querySelectorAll('.c-accordion');
        this.activeClass = 'js-accordion-active';
    }

    init() {
        this.event();
    }

    event() {
        const _self = this;

        Array.prototype.forEach.call(_self.accordion, (block) => {
            let accordionItems = block.querySelectorAll('.c-accordion__item'),
                activeItem = false;

            Array.prototype.forEach.call(accordionItems, (item) => {
                let itemAnswer = item.querySelector('.c-accordion__item-answer');

                if (itemAnswer) {
                    _self.defineRealItemHeight(itemAnswer);

                    window.addEventListener('resize', () => _self.defineRealItemHeight(itemAnswer));

                    itemAnswer.style.height = 0;

                    item.addEventListener('click', (e) => {
                        let trigger = e.target.closest('.c-accordion__item-trigger'),
                            question = e.target.closest('.c-accordion__item-question');

                        if (trigger || question) {
                            if ( activeItem && (activeItem !== item) ) {
                                activeItem.classList.remove(_self.activeClass);
                                activeItem.querySelector('.c-accordion__item-answer').style.height = 0;
                            }

                            if ( item.classList.contains(_self.activeClass) ) {
                                item.classList.remove(_self.activeClass);
                                itemAnswer.style.height = 0;
                            }
                            else {
                                item.classList.add(_self.activeClass);
                                itemAnswer.style.height = 'auto';
                                itemAnswer.style.height = itemAnswer.dataset.height;
                            }

                            activeItem = item;
                        }
                    });
                }
            });
        });
    }

    defineRealItemHeight(itemAnswer) {
        const _self = this;

        itemAnswer.closest('.c-accordion__item').classList.remove(_self.activeClass);
        itemAnswer.style.height = 'auto';
        itemAnswer.dataset.height = `${itemAnswer.offsetHeight}px`;
        itemAnswer.style.height = 0;
    }
}

new Accordion().init();



