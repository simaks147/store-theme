window.$ = jQuery;

class Form {
    constructor() {
        this.form = $('.c-form');
    }

    init() {
        this.addScripts();
        this.toggleActiveClass();
        this.addCustomClass();
        this.datePicker();
    }

    addScripts() {
        const _self = this;

        // selectize.js script
        window.addCustomScript({
            src: 'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.12.6/js/standalone/selectize.min.js',
        }, () => {
            _self.selectizeInit();

            $(document).on('gform_post_render', () => {
                let inputContainer =  $('.ginput_container_name span, .ginput_container_address span, .ginput_container_time');

                _self.selectizeInit();
                _self.addCustomClass();

                inputContainer.each((i, el) => {
                    if ( $(el).find('input').val() !== '' ) {
                        $(el).addClass('js-active');
                    }
                });
            });
        });
    }

    addCustomClass() {
        this.form.find('.ginput_container').each((i, el) => {
            let inputContainer = $(el);

            if ( inputContainer.is('.ginput_container_time') ) inputContainer.closest('li').addClass('js-gfield-time');
            else if ( inputContainer.is('.ginput_container_list') ) inputContainer.closest('li').addClass('js-gfield-list');
            else if ( inputContainer.is('.ginput_container_radio') ) inputContainer.closest('li').addClass('js-gfield-radio');
        });
    }

    toggleActiveClass() {
        const activeClassName = 'js-active';

        let selector1 = '.ginput_container_text input, .ginput_container_number input, .ginput_container_date input, .ginput_container_phone input, .ginput_container_website input, .ginput_container_email input, .ginput_container_textarea textarea',
            selector2 = '.ginput_container_name input, .ginput_container_address span > input',
            selector3 = '.ginput_container_time input';

        this.form
            .on('focusin', selector1, function (e) {
                $(e.currentTarget).closest('li').addClass(activeClassName);
            })
            .on('focusout', selector1, function (e) {
                setTimeout(() => {
                    if ($(e.currentTarget).val() === '') {
                        $(e.currentTarget).closest('li').removeClass(activeClassName);
                    }
                }, 100);
            })
            .on('focusin', selector2, function (e) {
                $(e.currentTarget).closest('span').addClass(activeClassName);
            })
            .on('focusout', selector2, function (e) {
                setTimeout(() => {
                    if ($(e.currentTarget).val() === '') {
                        $(e.currentTarget).closest('span').removeClass(activeClassName);
                    }
                });
            })
            .on('focusin', selector3, function (e) {
                $(e.currentTarget).closest('div').addClass(activeClassName);
            })
            .on('focusout', selector3, function (e) {
                setTimeout(() => {
                    if ($(e.currentTarget).val() === '') {
                        $(e.currentTarget).closest('div').removeClass(activeClassName);
                    }
                });

            });
    }

    selectizeInit() {
        const activeClassName = 'js-active',
            _self = this;

        let selects = _self.form.find('.ginput_container select:not(.ginput_container_time select, .ginput_container_address select)').selectize({
            hideSelected: false,
            closeAfterSelect: true,
            maxItems: 1,
            allowEmptyOption: true,
        });

        selects.each(function (i, el) {
            el.selectize.on('change', function() {
                this.$control.closest('li').addClass(activeClassName);
            });
        });

        let timeSelects = _self.form.find('.ginput_container_time select').selectize({
            hideSelected: false,
            closeAfterSelect: true,
            maxItems: 1,
            allowEmptyOption: true,
        });

        timeSelects.each(function (i, el) {
            el.selectize.on('change', function() {
                this.$control.closest('.ginput_container_time').addClass(activeClassName);
            });
        });

        let addressSelects = _self.form.find('.ginput_container_address select').selectize({
            hideSelected: false,
            closeAfterSelect: true,
            maxItems: 1,
            allowEmptyOption: true,
        });

        addressSelects.each(function (i, el) {
            el.selectize.on('change', function() {
                this.$control.closest('span').addClass(activeClassName);
            });
        });
    }

    datePicker() {
        window.addEventListener('resize', () => {
            let dataPickerInput = $('.datepicker');

            if (dataPickerInput.length) {
                dataPickerInput.datepicker('hide');

                dataPickerInput.each(function (i, el) {
                    let currentEl = $(el);

                    if (currentEl.val() === '') {
                        currentEl.closest('li').removeClass('js-active');
                    }
                });
            }
        });
    }
}

new Form().init();



