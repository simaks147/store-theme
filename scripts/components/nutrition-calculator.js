class nutritionCalculator {

    init() {
        this.event();

        let event = document.createEvent('Event');
        event.initEvent('resize', true, true);
        window.dispatchEvent(event);
    }

    event() {
        let calculatorIframe = document.getElementById('calculator-iframe'),
            screenSize;

        window.addEventListener('resize', () => {
            if (window.innerWidth < '1024' && screenSize !== 'mobile') {
                calculatorIframe.src = calculatorIframe.dataset.mobileSrc;
                calculatorIframe.style.height = '1200px';

                screenSize = 'mobile';
            }

            if (window.innerWidth >= '1024' && screenSize !== 'desktop') {
                calculatorIframe.src = calculatorIframe.dataset.desktopSrc;
                calculatorIframe.style.height = '760px';

                screenSize = 'desktop';
            }
        });
    }
}

new nutritionCalculator().init();



