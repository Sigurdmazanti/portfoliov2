import { throttle } from 'lodash';

const handlers = {
    resize: null,
    preventSameUrlRedirect: null,
    flickityKeydown: null
};

export function preventSameUrlRedirect() {
    handlers.preventSameUrlRedirect = (e) => {
        const href = e.currentTarget.getAttribute('href');
        const currentUrl = window.location.href.split('#')[0];
        const linkUrl = new URL(href, window.location.origin).href;

        if (linkUrl === currentUrl) {
            e.preventDefault();
        }
    };

    document.querySelectorAll('a').forEach((item) => {
        item.addEventListener('click', handlers.preventSameUrlRedirect);
    });
}

export function addResizeListener(handler) {
    handlers.resize = throttle(handler, 750);
    window.addEventListener('resize', handlers.resize);
}

export function removeResizeListener() {
    if (handlers.resize) {
        window.removeEventListener('resize', handlers.resize);
        handlers.resize = null;
    }
}

export function addFlickityKeydownListener() {
    handlers.flickityKeydown = (event) => {
        if (event.key === 'ArrowLeft') {
            event.stopImmediatePropagation();
            document.getElementById('flickityPrev').dispatchEvent(new Event('click'));
        }

        if (event.key === 'ArrowRight') {
            event.stopImmediatePropagation();
            document.getElementById('flickityNext').dispatchEvent(new Event('click'));
        }
    };
    window.addEventListener('keydown', handlers.flickityKeydown);
}

export function removeFlickityKeydownListener() {
    if (handlers.flickityKeydown) {
        window.removeEventListener('keydown', handlers.flickityKeydown);
        handlers.flickityKeydown = null;
    }
}