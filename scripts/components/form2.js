class Form2 {
    constructor() {
        this.forms = document.querySelectorAll('.c-form2');
        this.items = document.querySelectorAll('.dcf-column');

    }

    init() {
        this.addScripts();
        this.addClass();
        this.toggleActiveClass();
    }

    addScripts() {
        const _self = this;


        // custom select script
        window.addCustomScript({
            src: 'https://cdn.jsdelivr.net/npm/custom-select@1.1.15/build/custom-select.min.js',
        }, () => _self.customSelectInit()
        )}

    addClass() {
        const _self = this;

        Array.prototype.forEach.call(_self.items, (item) => {
            let button = item.querySelector('button');

            if ( item.contains( item.querySelector('select') ) ) {
                item.classList.add('js-dcf-select');
            }

            if ( item.contains( item.querySelector('textarea') ) ) {
                item.classList.add('js-dcf-textarea');
            }

            if ( item.contains( button ) ) {
                item.classList.add('js-dcf-button');
                button.classList.add('c-button');
            }
        });
    }

    toggleActiveClass() {
        const _self = this;

        Array.prototype.forEach.call(_self.forms, (form) => {
            form.addEventListener('focusin', (e) => {
                if (e.target.matches('input, textarea') && !e.target.value) {
                    e.target.closest('.dcf-column').classList.add('js-active');
                }
            });

            form.addEventListener('focusout', (e) => {
                if (e.target.matches('input, textarea') && !e.target.value) {
                    e.target.closest('.dcf-column').classList.remove('js-active');
                }
            });
        });
    }


    customSelectInit() {
        let selects = window.customSelect('.c-form2 select');

        selects.forEach((cstSel) => {
            cstSel.select.value = '';

            cstSel.select.addEventListener('change', (e) => {
                let selectContainer = e.target.closest('.dcf-column'),
                    errorContainer = selectContainer.querySelector('.dcf-error-message');

                selectContainer.classList.add('js-active');

                if (errorContainer) {
                    errorContainer.style.display = 'none';
                    errorContainer.style.visibility = 'hidden';
                }
            });

        });
    }
}

new Form2().init();



