// import { flickity } from '../app';
import { addFlickityKeydownListener } from './eventListeners';
import { flickityReadyAnimations } from '../animations/animations';

import Flickity from 'flickity';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);


let flickity;

export async function addFlickity(element, data) {
    flickity = new Flickity(element, {
        cellAlign: 'right',
        cellSelector: '.slide',
        pageDots: false,
        wrapAround: true,
        draggable: false,
        prevNextButtons: false,
        lazyLoad: true,
        selectedAttraction: 1,
        friction: 1,
        on: {
            ready: function() {
                flickityReadyAnimations(data);
            }
        }
    });
    const prevBtn = data.next.container.querySelector('#flickityPrev');
    const nextBtn = data.next.container.querySelector('#flickityNext');
    const flickityCurrentSlide = data.next.container.querySelector('#flickityCurrentSlide');
    const flickityTotalSlides = data.next.container.querySelector('#flickityTotalSlides');

    flickityTotalSlides.textContent = flickity.cells.length;

    flickity.on('change', (index) => {
        flickityIn(index);
    });

    flickity.on('settle', (index) => {
        flickityChangeIndex(flickityCurrentSlide, index);
    });

    addFlickityKeydownListener();

    // todo: add page dots and if backwards: prev, if forwards: next
    prevBtn.addEventListener('click', () => {
        let currentSlideIndex = flickity.selectedIndex;
        flickityOut(currentSlideIndex, 'prev');
    });

    nextBtn.addEventListener('click', () => {
        let currentSlideIndex = flickity.selectedIndex;
        flickityOut(currentSlideIndex, 'next');
    });
}

export function flickityIn(nextIndex, state = false) {
    const slides = document.querySelectorAll('#projects-slider .slide');
    const nextSlide = slides[nextIndex];

    const mockups = document.querySelectorAll('#projects-slider .group');
    const nextMockup = mockups[nextIndex];
    const activeMockup = document.querySelector('#projects-slider .group.active');

    const tl = gsap.timeline({defaults: {ease: 'power2.in'}});
    const translatableElements = nextSlide.querySelectorAll('.will-animate');
    const staggerDuration = 0.01;
    const easing = CustomEase.create("custom", "M0,0 C0.68,-0.6 0.09,0.9 1,1");

    translatableElements.forEach((item, index) => {
        tl.fromTo(item, 
            {
                x: 300
            },
            
            {
                x: 0,
                ease: easing,
                duration: 1.15,
            }, index * staggerDuration,
        ).fromTo(item, 
            {
                autoAlpha: 0
            },
            {
                autoAlpha: 1,
                duration: 0.3
            }, index * staggerDuration + 0.3
        );
    });

    gsap.to(nextMockup, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
            nextMockup.classList.add('active');
        }
    });

    if (!state) {
        gsap.to(activeMockup, {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                activeMockup.classList.remove('active');
            }
        });
    }
}

export function flickityOut(currentIndex, state) {
    const slides = document.querySelectorAll('#projects-slider .slide');
    const currentSlide = slides[currentIndex];

    const tl = gsap.timeline({defaults: {duration: .5, ease: 'power2.in'}});
    const translatableElements = currentSlide.querySelectorAll('.will-animate');
    const easing = CustomEase.create("custom", "M0,0 C0.68,-0.6 0.09,0.9 1,1");

    translatableElements.forEach((item, index) => {
        tl.to(item, {
            x: 300,
            ease: easing,
            duration: 1.35,
        }, index * 0.01)
        .to(item, {
            autoAlpha: 0,
            duration: 0.3,
        }, index * 0.01 + 0.3)
    })

    if (state == 'next') {
        tl.add(() => {
            flickity.next();
        }, "-=0.4");

        return;
    }

    if (state == 'prev') {
        tl.add(() => {
            flickity.previous();
        }, "-=0.4");
    }
}

export async function removeFlickity() {
    flickity.destroy();
}

function flickityChangeIndex(element, index) {
    const tl = gsap.timeline();

    tl.to(element, {
        autoAlpha: 0,
        duration: 0.2
    })
    .to(element, {
        text: index + 1,
        duration: 0
    })
    .to(element, {
        autoAlpha: 1,
        duration: 0.3
    })
}