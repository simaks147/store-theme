window.$ = jQuery;

class Form3 {
    constructor() {
        this.form = $('.c-form3');
    }

    init() {
        this.addScripts();
        this.toggleActiveClass();
        this.dataPicker();
    }

    addScripts() {
        const _self = this;

        // selectize.js script
        window.addCustomScript({
            src: 'https://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.13.3/js/standalone/selectize.min.js',
        }, () => {
            _self.selectizeInit();

            $(document).on( 'frmPageChanged', function() {
                _self.selectizeInit();
            });
        });
    }

    toggleActiveClass() {
        const activeClassName = 'js-active',
            selector = '.frm_form_field input[type="text"], .frm_form_field input[type="email"], .frm_form_field textarea';

        this.form
            .on('focusin', selector, function (e) {
                $(e.currentTarget).closest('.frm_form_field').addClass(activeClassName);
            })
            .on('focusout', selector, function (e) {
                setTimeout(() => {
                    if ($(e.currentTarget).val() === '') {
                        $(e.currentTarget).closest('.frm_form_field').removeClass(activeClassName);
                    }
                }, 100);
            });
    }

    selectizeInit() {
        const _self = this;

        let selects = _self.form.find('select').selectize({
            hideSelected: false,
            closeAfterSelect: true,
            maxItems: 1,
            allowEmptyOption: true,
            selectOnTab: false,
        });

        selects.each(function (i, el) {
            el.selectize.on('change', function() {
                this.$control.closest('.frm_form_field').addClass('js-active');
            });
        });
    }

    dataPicker() {
        $('.frm_date').datepicker({
            onSelect: function(date, inst) {
                $(inst.input).closest('.frm_form_field').addClass('js-active');
            },
        });
    }
}

new Form3().init();



