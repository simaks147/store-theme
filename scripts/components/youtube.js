class YoutubeVideo {
    constructor() {
        this.videoContainers = document.querySelectorAll('[data-youtube-video-container]');
        this.players = {};
    }

    init() {
        const _self = this;

        Array.prototype.forEach.call(_self.videoContainers, (videoContainer) => {
            _self.prependPoster(videoContainer);

            _self.event(videoContainer);
        });
    }

    prependPoster(videoContainer) {
        let videoId = videoContainer.dataset.youtubeVideoId,
            poster;

        if (videoId) {
            poster = document.createElement('img');

            poster.src = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;

            videoContainer.prepend(poster);

            videoContainer.classList.add('js-youtube-poster-loaded');
        }
    }

    event(videoContainer) {
        const _self = this;

        videoContainer.querySelector('[data-youtube-video-play]').addEventListener('click', (e) => {
            if (e.target.closest('[data-youtube-video-play]')) {
                if (!window.YT) {
                    _self.addPlayerApi(videoContainer);
                } else {
                    document.body.classList.add('js-youtube-video-popup-active');
                    videoContainer.classList.add('js-youtube-video-active');

                    _self.disableScroll();

                    if (!videoContainer.classList.contains('js-youtube-video-loaded')) {
                        _self.initPlayer(videoContainer);

                        videoContainer.classList.add('js-youtube-video-loaded');
                    } else {
                        _self.players[videoContainer.dataset.youtubeVideoId].playVideo();
                    }
                }
            }
        });

        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('js-youtube-video-popup-active')) {
                if (!e.target.closest('[data-youtube-video-popup]') || e.target.closest('[data-youtube-video-close]')) {
                    document.body.classList.remove('js-youtube-video-popup-active');

                    _self.enableScroll();

                    Array.prototype.forEach.call(_self.videoContainers, (videoContainer) => {

                        if (videoContainer.classList.contains('js-youtube-video-active')) {
                            videoContainer.classList.remove('js-youtube-video-active');

                            _self.players[videoContainer.dataset.youtubeVideoId].pauseVideo();

                            _self.players[videoContainer.dataset.youtubeVideoId].seekTo(0);
                        }
                    });
                }
            }
        }, true);
    }

    addPlayerApi(videoContainer) {
        const _self = this;

        // youtube iframe player api
        window.addCustomScript({
            src: 'https://www.youtube.com/iframe_api',
        }, () => {
            document.body.classList.add('js-youtube-video-popup-active');
            videoContainer.classList.add('js-youtube-video-active', 'js-youtube-video-loaded');

            _self.disableScroll();

            window.onYouTubeIframeAPIReady = function () {
                _self.initPlayer(videoContainer);
            }
        });
    }

    initPlayer(videoContainer) {
        const _self = this,
            videoId = videoContainer.dataset.youtubeVideoId;

        _self.players[videoId] = new window.YT.Player(videoContainer.querySelector('[data-youtube-video-popup-inner]'), {
            videoId,
            playerVars: {
                autoplay: 1,
            },
            events: {
                onStateChange: (e) => {
                    if (e.data === window.YT.PlayerState.ENDED) {
                        document.body.classList.remove('js-youtube-video-popup-active');
                        videoContainer.classList.remove('js-youtube-video-active');

                        _self.enableScroll();

                        if (document.exitFullscreen) {
                            document.exitFullscreen();
                        }
                        else if (document.webkitExitFullscreen) {
                            document.webkitExitFullscreen();
                        }
                    }
                },
            },
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

new YoutubeVideo().init();



