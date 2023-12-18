class SearchTeam {
    constructor() {
        this.searchTeamSection = document.getElementById('search-team');
        this.searchString = document.getElementById('search-team-search-string');
        this.input = document.getElementById('search-team-input');
        this.searchButton = document.getElementById('search-team-button');
        this.continueButton = document.getElementById('search-team-continue-button');
        this.formSection = document.getElementById('search-team-form');
        this.resultsContainer = document.getElementById('search-team-results');
        this.locations = JSON.parse(this.searchTeamSection.dataset.locations);
        this.emails = [];
        this.fields = [];
        this.apiKey = 'AIzaSyDoAQGcNYYT0S-N9VmDjDf-zWqItOQJXOU';
        this.toggleButtons = '<div class="custom-gform-fields-toggle-buttons"><div class="custom-gform-fields-container-add">add +</div><div class="custom-gform-fields-container-remove">remove -</div></div>';

    }

    init() {
        this.initMapApi();
    }

    initMapApi() {
        const _self = this;

        window.addCustomScript({
            //add google map api
            src: `https://maps.googleapis.com/maps/api/js?key=${_self.apiKey}&libraries=places`,
        }, () => {
            _self.event();
        });
    }

    event() {
        const _self = this;
        const autocomplete = new window.google.maps.places.Autocomplete(_self.input);

        // search place by click button
        _self.searchButton.addEventListener('click', () => {
            _self.searchByClick();
        });

        // display form by click button
        _self.continueButton.addEventListener('click', () => {
            let checkboxes = _self.resultsContainer.querySelectorAll('input');

            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    _self.displayForm();
                    break;
                }
                else {
                    if (i === checkboxes.length - 1) {
                        window.alert('Please select a location');
                    }
                }
            }
        });

        // search by press key Enter
        // document.addEventListener('keydown', (e) => {
        //     if (e.code === 'Enter') {
        //         _self.searchByClick();
        //     }
        // });

        // searching place by select place or by press key Enter
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            _self.resultsContainer.innerHTML = '';

            if (!place.geometry) {
                _self.searchByClick();
                return;
            }

            _self.appendSearchResults(_self.input.value, place.geometry.location);
        });
    }

    searchByClick() {
        const _self = this;
        const geocoder = new window.google.maps.Geocoder();
        const address = _self.input.value;

        _self.resultsContainer.innerHTML = '';

        geocoder.geocode({address}, (results, status) => {
            if (status === 'OK') {
                _self.appendSearchResults(address, results[0].geometry.location);
            }
            else {
                window.alert(`No details available for input: ${address}`);
            }
        });
    }

    appendSearchResults(address, center) {
        const _self = this;
        const circle = new window.google.maps.Circle({
            center,
            radius: 15000,
        });
        const newBounds = circle.getBounds();

        let layout = '';
        let resultsCount = 0;

        _self.emails = [];

        _self.locations.forEach((loc) => {
            if (loc.location_address && newBounds.contains({lat: parseFloat(loc.location_address.lat), lng: parseFloat(loc.location_address.lng)})) {
                layout += _self.itemLayout(loc);

                resultsCount += 1;
            }
        });

        _self.searchString.textContent = address;

        if (resultsCount > 0) {
            _self.resultsContainer.innerHTML = layout;

            document.body.classList.remove('js-no-search-results');
            document.body.classList.add('js-yes-search-results');
        } else {
            document.body.classList.remove('js-yes-search-results');
            document.body.classList.add('js-no-search-results');
        }

        if ( !document.body.classList.contains('js-search-was') ) {
            document.body.classList.add('js-search-was');
        }
    }

    itemLayout(loc) {
        const address = loc.location_address;
        const id = loc.location_id;
        const email = loc.careers_email_address;

        return `
            <div class="c-search-team__locations-item">
                <label class="c-search-team__locations-item-check">
                    <input type="checkbox" name="loc_email" value="${email}" data-loc-id="${id}" data-loc-place="${address.city} ${address.state}">
                    <b></b>
                </label>
                <div class="c-search-team__locations-item-text">${address.city}, ${address.state_short} - ${address.street_number} ${address.street_name}</div>
            </div>
        `;
    }

    displayForm() {
        const _self = this;

        console.log(_self.formSection.dataset.scriptUrl);

        window.addCustomScript({
            src: _self.formSection.dataset.scriptUrl,
            type: 'module',
        }, () => {
            let checkboxes = document.getElementsByName('loc_email'),
                loc_ids = [],
                loc_names = [];

            document.body.classList.add('js-form-visible');

            for (var index = 0; index < checkboxes.length; index++) {
                let value = checkboxes[index].value

                if ( checkboxes[index].checked ) {
                    loc_ids.push(checkboxes[index].dataset.locId);
                    loc_names.push(checkboxes[index].dataset.locPlace);
                }

                _self.formSection.querySelector('#field_location-id').value = loc_ids.join(', ');
                _self.formSection.querySelector('#field_location-name').value = loc_names.join(', ');

                if ( checkboxes[index].checked && !_self.emails.includes(value) ) {
                    _self.emails.push(value);
                }
            }


            _self.data = {
                action: 'loc_emails',
                loc_emails: _self.emails,
                form_fields: _self.fields,
            };

            $(document).on('frmFormComplete', () => {
                $.post(window.myajax.url, _self.data);
            });

            $(document).on( 'frmPageChanged', function() {
                $('.frm_text_container, .frm_email_container, .frm_date_container, .frm_select_container').find('input').each((i, el) => {
                    if ( $(el).val() !== '') {
                        $(el).closest('.frm_form_field').addClass('js-active');
                    }
                });

                $('.frm_textarea_container').find('textarea').each((i, el) => {
                    if ( $(el).val() !== '') {
                        $(el).closest('.frm_form_field').addClass('js-active');
                    }
                });

                $('.frm_select_container').find('option').first().each((i, el) => {
                    if ( $(el).val() !== '') {
                        $(el).closest('.frm_form_field').addClass('js-active');
                    }
                });

                $('.frm_date').datepicker({
                    onSelect: function(date, inst) {
                        $(inst.input).closest('.frm_form_field').addClass('js-active');
                    },
                });
            });

            $('.frm_submit').on('click', () => {
                _self.fieldsData();
            });
        });
    }

    fieldsData() {
        const _self = this;

        _self.fields = [];

        let fieldsElements = $(_self.formSection).find('.frm_form_field, .frm_repeat_sec').not('.frm_repeat_buttons');

        fieldsElements.each( (i, el) => {
            let currentElement = $(el),
                label = currentElement.find('.frm_primary_label').first().contents().not( (currentElement).children() ).text().trim();

            _self.fields.push(
                {
                    label,
                    value: null,
                    type: 'default',
                }
            );

            if ( currentElement.hasClass('frm_textarea_container') ) {
                _self.fields[i].value = currentElement.find('textarea').val();
            }
            else if ( currentElement.hasClass('frm_radio_container') ) {
                let radioInputs = currentElement.find('input');

                radioInputs.each( (i2, el2) => {
                    let currentInput = $(el2);

                    if ( currentInput.prop('checked') ) {
                        _self.fields[i].value = currentInput.val();
                    }
                } );
            }
            // else if ( currentElement.hasClass('custom-gfield-checkbox') ) {
            //     let checkboxValues = [],
            //         checkboxInputs = currentElement.find('input');
            //
            //     checkboxValues = [];
            //
            //     checkboxInputs.each( (i, el) => {
            //         let currentCheckbox = $(el);
            //
            //         if ( currentCheckbox.prop('checked') ) {
            //             checkboxValues.push( currentCheckbox.val() );
            //         }
            //     } );
            //
            //     _self.fields[i].value = checkboxValues;
            // }
            else if ( currentElement.hasClass('frm_select_container') ) {
                _self.fields[i].value = currentElement.find('select').find('option').val();
            }
            else if ( currentElement.hasClass('frm_html_container') ) {
                _self.fields[i].label = currentElement.text();
                _self.fields[i].type = 'html';
            }
            else if ( currentElement.hasClass('frm_repeat_sec') ) {
                _self.fields[i].type = 'section';
            }
            else if ( currentElement.hasClass('frm_section_heading') ) {
                _self.fields[i].label = currentElement.find('h3').first().text();
                _self.fields[i].type = 'heading';
            }
            else {
                _self.fields[i].value = currentElement.find('input').val();
            }
        } );

        _self.data.form_fields = _self.fields;
    }
}

new SearchTeam().init();



