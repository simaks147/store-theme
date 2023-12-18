class VimeoVideo {
    constructor() {
        this.videoContainers = document.querySelectorAll('[data-vimeo-video-container]');
        this.players = {};
    }

    init() {
        const _self = this;

        Array.prototype.forEach.call(_self.videoContainers, (videoContainer) => {
            _self.fetchPoster(videoContainer);

            _self.event(videoContainer);
        });
    }

    fetchPoster(videoContainer) {
        let videoId = videoContainer.dataset.vimeoVideoId,
            url,
            poster;

        if (videoId) {
            url = `https://vimeo.com/api/v2/video/${videoId}.json `;

            fetch(url)
                .then(response => response.json())
                .then((commits) => {
                    poster = document.createElement('img');

                    poster.src = commits[0].thumbnail_large;

                    videoContainer.prepend(poster);

                    videoContainer.classList.add('js-vimeo-poster-loaded');
                });
        }
    }

    event(videoContainer) {
        const _self = this;

        videoContainer.querySelector('[data-vimeo-video-play]').addEventListener('click', (e) => {
            if (e.target.closest('[data-vimeo-video-play]')) {
                if (!window.Vimeo) {
                    _self.addPlayerApi(videoContainer);
                } else {
                    document.body.classList.add('js-vimeo-video-popup-active');
                    videoContainer.classList.add('js-vimeo-video-active');

                    _self.disableScroll();

                    if (!videoContainer.classList.contains('js-vimeo-video-loaded')) {
                        _self.initPlayer(videoContainer);

                        videoContainer.classList.add('js-vimeo-video-loaded');
                    } else {
                        _self.players[videoContainer.dataset.vimeoVideoId].play();
                    }
                }
            }
        });

        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('js-vimeo-video-popup-active')) {
                if (!e.target.closest('[data-vimeo-video-popup]') || e.target.closest('[data-vimeo-video-close]')) {
                    document.body.classList.remove('js-vimeo-video-popup-active');

                    _self.enableScroll();

                    Array.prototype.forEach.call(_self.videoContainers, (videoContainer) => {
                        if (videoContainer.classList.contains('js-vimeo-video-active')) {
                            videoContainer.classList.remove('js-vimeo-video-active');

                            _self.players[videoContainer.dataset.vimeoVideoId].pause();

                            _self.players[videoContainer.dataset.vimeoVideoId].setCurrentTime(0);
                        }
                    });
                }
            }
        }, true);


    }

    addPlayerApi(videoContainer) {
        const _self = this;

        // vimeo player.js script
        window.addCustomScript({
            src: 'https://player.vimeo.com/api/player.js',
        }, () => {
            document.body.classList.add('js-vimeo-video-popup-active');
            videoContainer.classList.add('js-vimeo-video-active', 'js-vimeo-video-loaded');

            _self.disableScroll();
            _self.initPlayer(videoContainer);
        });
    }

    initPlayer(videoContainer) {
        const _self = this,
            id = videoContainer.dataset.vimeoVideoId;

        _self.players[id] = new window.Vimeo.Player(videoContainer.querySelector('[data-vimeo-video-popup]'), {
            id,
            loop: false,
            autoplay: true,
            responsive: true,
            controls: true,
        });

        _self.players[id].on('ended', () => {
            document.body.classList.remove('js-vimeo-video-popup-active');
            videoContainer.classList.remove('js-vimeo-video-active');

            _self.enableScroll();

            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        });
    }

    preventDefault(e) {
        e.preventDefault();
    }

    disableScroll() {
        const _self = this;

        window.addEventListener('wheel', _self.preventDefault, {passive: false});
        window.addEventListener('touchmove', _self.preventDefault, {passive: false});
    }

    enableScroll() {
        const _self = this;

        window.removeEventListener('wheel', _self.preventDefault, {passive: false});
        window.removeEventListener('touchmove', _self.preventDefault, {passive: false});
    }
}

new VimeoVideo().init();



