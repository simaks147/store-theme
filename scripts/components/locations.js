class Locations {
    constructor() {
        this.mapContainer = document.getElementById('search-location-map');
        this.input = document.getElementById('search-location-input');
        this.button = document.getElementById('search-location-button');
        this.resultsContainer = document.getElementById('search-location-results');
        this.locations = JSON.parse(this.mapContainer.dataset.locations);
        this.apiKey = 'AIzaSyDoAQGcNYYT0S-N9VmDjDf-zWqItOQJXOU';
    }

    init() {
        // console.log(this.locations);
        if (this.mapContainer) {
            this.initMap();
        }
    }

    initMap() {
        const _self = this;

        let zoom;

        if (document.documentElement.clientWidth >= 768) zoom = 5;
        else zoom = 4;

        window.addCustomScript({
            //add google map api
            src: `https://maps.googleapis.com/maps/api/js?key=${_self.apiKey}&libraries=places`,
        }, () => {
            _self.map = new window.google.maps.Map(_self.mapContainer, {
                center: {lat: 35.8438868, lng: -78.7150955},
                zoom,
            });

            _self.setMarkers();

            _self.event();
        });
    }

    setMarkers() {
        const _self = this;

        _self.locations.forEach(({location_address}) => {
            if (location_address) {
                new window.google.maps.Marker({
                    position: {lat: parseFloat(location_address.lat), lng: parseFloat(location_address.lng)},
                    map: _self.map,
                });
            }
        });
    }

    event() {
        const _self = this;
        const autocomplete = new window.google.maps.places.Autocomplete(_self.input);

        // search place by click button
        _self.button.addEventListener('click', () => {
            _self.searchByClick();
        });

        // search by press key Enter
        // document.addEventListener('keydown', (e) => {
        //     if (e.code === 'Enter') {
        //         _self.searchByClick();
        //     }
        // });

        // searching place by select place
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();

            _self.resultsContainer.innerHTML = '';

            if (!place.geometry) {
                _self.searchByClick();
                return;
            }

            if (place.geometry.viewport) {
                _self.map.fitBounds(place.geometry.viewport);
            } else {
                _self.map.setCenter(place.geometry.location);
            }

            _self.map.setZoom(12);

            _self.appendSearchResults();
        });

        // change location list if viewport bounds changed
        setTimeout(() => {
            _self.map.addListener('bounds_changed', () => {
                _self.appendSearchResults();
            });
        }, 2000);
    }

    searchByClick() {
        const _self = this;
        const geocoder = new window.google.maps.Geocoder();
        const address = _self.input.value;

        _self.resultsContainer.innerHTML = '';

        geocoder.geocode({address}, (results, status) => {
            const data = results[0];

            if (status === 'OK') {
                const bounds = new window.google.maps.LatLngBounds();

                if (data.geometry.viewport) {
                    bounds.union(data.geometry.viewport);
                } else {
                    bounds.extend(data.geometry.location);
                }

                _self.map.fitBounds(bounds);

                _self.map.setZoom(12);

                _self.appendSearchResults();
            }
            else {
                window.alert(`No details available for input: ${address}`);
            }
        });
    }

    appendSearchResults() {
        const _self = this;
        const newBounds = _self.map.getBounds();

        let layout = '';
        let resultsCount = 0;

        _self.locations.forEach((loc) => {
            if (loc.location_address && newBounds.contains({lat: parseFloat(loc.location_address.lat), lng: parseFloat(loc.location_address.lng)})) {
                layout += _self.itemLayout(loc);

                resultsCount += 1;
            }
        });

        if (resultsCount > 0) {
            if (_self.oldResultsLayout !== layout) {
                _self.resultsContainer.classList.add('js-results-hidden');

                _self.resultsContainer.innerHTML = _self.oldResultsLayout = layout;

                // loading inserted images with class 'lazy'
                window.lazyLoadInstance.update();

                Array.prototype.forEach.call(_self.resultsContainer.querySelectorAll('.c-tiles__item'), (item) => {
                    setTimeout(() => item.classList.add('js-in'), 0);
                });

                document.body.classList.remove('js-no-search-results');

                setTimeout(() => {
                    _self.resultsContainer.classList.remove('js-results-hidden');
                }, 1000);
            }

        } else {
            _self.resultsContainer.innerHTML = _self.oldResultsLayout = '';

            document.body.classList.add('js-no-search-results');
        }
    }

    itemLayout(loc) {
        const address = loc.location_address;

        return `
            <div class="c-tiles__item">
                <div class="c-tiles__item-image">${loc.image}</div>
                <div class="c-tiles__item-content">
                    <div class="c-tiles__item-title" style="margin-bottom: 14px">${address.city}, ${address.state_short}</div>
                    <div class="c-tiles__item-text2">
                        <div>${address.street_number} ${address.street_name}</div>
                        <div>${address.city}, ${address.state_short} ${address.post_code}</div>
                    </div>
                    <div class="c-tiles__item-text" style="line-height: 1.4;">${loc.hours}</div>
                    <a href="#" class="c-button" style="margin-top: 20px">Get Directions</a>
                </div>
            </div>
        `;
    }
}

new Locations().init();



