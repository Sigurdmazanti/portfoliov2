import { overlaySlider } from './functions/overlay';
import { display } from './functions/landing';
import { vh, vw, disableLink, waitForNextNamespace, trackDirection } from './functions/helpers';

import Flickity from 'flickity';
import throttle from 'lodash/throttle';
import Blobity from 'blobity';

import barba from '@barba/core';
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin,CustomEase);
// =========================================================
// ==============   GSAP tweens & timelines   ==============
// =========================================================
let insertModalResponsivenessTimeline;

let insertLandingTextTween;

let insertTriggeredBoxTween,
    removeTriggeredBoxTween;

let insertFullscreenBackgroundTimeline;

let insertTopNavTimeline,
    insertHomeLinkTimeline;

let removeBackButtonTween,
    insertBackButtonTween;

let insertNavBoxTextsTimeline,
    removeNavBoxTextsTimeline,
    insertNavBoxesTimeline,
    removeNavBoxesTimeline;

let insertFlickityTimeline,
    removeFlickityTimeline;

let insertSocialsColorsTimeline;

let insertAboutTextsTimeline,
    removeAboutTextsTimeline;
// =========================================================
// ==============         General        ==============
// =========================================================
let blobity;
let flickity;
const throttledResizeHandler = throttle(responsivenessModal, 750);

document.addEventListener('DOMContentLoaded', function() { 
    blobity = addBlobity();
    preventSameUrlRedirect();
    responsivenessModal();
    window.addEventListener('resize', throttledResizeHandler);
});

function addBlobity() {
    return new Blobity({
        color: 'rgb(180, 180, 180)',
        licenseKey: 'opensource',
        invert: true,
        radius: 25,
        size: 28,
        font: "Neue Regrade Variable",
        fontSize: 18,
        tooltipPadding: 16,
        focusableElements: '[data-blobity], a:not([data-no-blobity]), button:not([data-no-blobity]):not(.flickity-button), [data-blobity-tooltip], button:not(.flickity-button)'
    });
}

function preventSameUrlRedirect() {
    document.querySelectorAll('a').forEach((item) => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            const currentUrl = window.location.href.split('#')[0];
            const linkUrl = new URL(href, window.location.origin).href;
    
            if (linkUrl === currentUrl) {
                e.preventDefault();
            }
        })
    })
}

function responsivenessModal() {
    const windowWidth = window.innerWidth;
    const modal = document.getElementById('responsiveness-modal');

    if (windowWidth > 1320 && modal) {
        insertModalResponsivenessTimeline.reverse();
        return;
    }

    if (modal) {
        insertModalResponsivenessTimeline.play();
        return;
    }

    if (sessionStorage.getItem('modal-closed') == 'true' || windowWidth > 1320) {
        return;
    }

    const body = document.body;
    const template = `
        <div id="responsiveness-modal">
            <div id="responsiveness-modal-overlay" class="close-modal"></div>
            <div id="responsiveness-modal-content">
                <button type="button" aria-label="Close modal" class="close-modal close-btn flickity-button">
                    <img src="./assets/icons/close.svg" alt="Close button icon">
                </button>
                <h3>Dear visitor</h3>
                <p>This project is being developed during my exams, and therefore I cannot commit the time to fully complete it just yet.<br>
                For the best experience, I encourage you to revisit this website on a screensize of minimum 1320px width,
                or expand the browserwindow horizontally, as the website has not been optimized for smaller screens yet.</p>
                <button type="button"
                class="close-modal main-btn"
                aria-label="I understand, continue to website"
                data-blobity-radius="20">I understand</button>
            </div>
        </div>`;

    body.insertAdjacentHTML('afterbegin', template);

    document.querySelectorAll('.close-modal').forEach( (item) => {
        item.addEventListener('click', () => {
            sessionStorage.setItem('modal-closed', 'true');
            window.removeEventListener('resize', throttledResizeHandler);
            insertModalResponsivenessTimeline.reverse();
        })
    });

    insertModalResponsivenessTimeline = gsap.timeline();

    const templateDOM = document.getElementById('responsiveness-modal');
    const templateOverlay = templateDOM.querySelector('#responsiveness-modal-overlay');
    const templateContent = templateDOM.querySelector('#responsiveness-modal-content');

    insertModalResponsivenessTimeline.to(templateDOM, {
        display: 'block',
        delay: 0.5
    })
    .to(templateOverlay, {
        autoAlpha: 1,
        duration: 0.3
    })
    .fromTo(templateContent, 
        {
            autoAlpha: 0,
            yPercent: -70,
            xPercent: -50
        },
        {            
            autoAlpha: 1,
            yPercent: -50,
            duration: 0.4
        }
    )

    return insertModalResponsivenessTimeline;
}
// =========================================================
// ==============         Views        ==============
// =========================================================
const projectsView = {
    namespace: 'projects',
    beforeEnter(data) {
        if(!data.current.container) {
            beforeEnterProjects(data);
        }
    }
};

const aboutView = {
    namespace: 'about',
    beforeEnter(data) {
        if(!data.current.container) {
            beforeEnterAbout(data);
        }
    }
}

const homeView = {
    namespace: 'home',
    beforeEnter(data) {
        if (!data.current.container) {
            beforeEnterHome(data);
        }
    }
}

const socialsView = {
    namespace: 'socials',
    beforeEnter(data) {
        preventSameUrlRedirect();

        if (!data.current.container) {
            beforeEnterSocials(data);
        }
    }
}
// =========================================================
// ==============     Barba initialization     ==============
// =========================================================
barba.init({
    transitions: [{
        async leave(data) {
            await waitForNextNamespace(data);

            if(data.current.namespace === 'home') {

                if(data.next.namespace === 'projects') {
                    await leaveHomeEnterProjectsAnimations(data);
                    return;
                }

                if(data.next.namespace === 'socials') {
                    await leaveHomeEnterSocialsAnimations(data);
                    return;
                }

                await leaveHomeAnimations(data);
            }


            if(data.current.namespace === 'about') {
                await leaveAboutAnimations(data);
                return;
            }

            if(data.current.namespace === 'projects') {
                if (data.next.namespace === 'home') {
                    await leaveProjectsEnterHomeAnimations(data);
                    return;
                }
            }

            if(data.current.namespace === 'socials') {
                await leaveSocialsAnimations(data);
            }
        },

        async enter(data) {
            if(data.next.namespace === 'home')  {
                if(data.current.namespace === 'socials') {
                    await enterHomeLeaveSocialsAnimations(data);
                    return;
                }
                await enterHomeAnimations(data);
                return;
            }
            if(data.next.namespace === 'projects') {
                await enterProjectsAnimations(data);
                return;
            }
            if(data.next.namespace === 'about') {
                await enterAboutAnimations(data);
                blobity.reset();
                return;
            }

            if(data.next.namespace === 'socials') {
                if(data.current.namespace === 'about') {
                    await enterSocialsLeaveAboutAnimations(data);
                    return;
                }
                await enterSocialsAnimations(data);
            }
        }
    }],
    views: [projectsView, homeView, aboutView, socialsView]
});
// =========================================================
// ==============         beforeEnterViews        ==============
// =========================================================
function beforeEnterHome(data) {
    insertLandingText(data);
    //landingBoxesAnimation(data); // TODO: remove this line. include above again.
}

function beforeEnterAbout(data) {
    document.body.classList.add('interactive');
    insertBackButton(data);
    insertAboutText(data);
    insertTopNav();
    overlaySlider();
}

async function beforeEnterProjects(data) {
    document.body.classList.add('interactive');
    document.body.classList.add('black-bg');
    document.getElementById('nav-text-mirror-container').classList.add('landed');
    insertBackButton(data);
    insertTopNav(data);
    await addFlickity(data.next.container.querySelector('#projects-slider'), data);
    flickityIn(0, 'init');
}

async function beforeEnterSocials(data) {
    document.body.classList.add('interactive');
    insertBackButton(data);
    insertTopNav(data);
    await insertNavBoxes(data);
    await addActiveClassToNavBoxes(data);
    await insertSocialsColors(data);
}
// =========================================================
// ==============      enterViewAnimations      ==============
// =========================================================
async function enterHomeAnimations(data) {
    await insertNavBoxes(data);
}

async function enterAboutAnimations(data) {
    await removeTriggeredBox(data);
    insertBackButton(data);
    insertAboutText(data);
}

async function enterProjectsAnimations(data) {
    addFlickity(data.next.container.querySelector('#projects-slider'), data);
    insertBackButton(data);
    flickityIn(0, 'init');
}

async function enterSocialsAnimations(data) {
    insertBackButton(data);
    await addActiveClassToNavBoxes(data);
    await insertSocialsColors(data);
}

async function enterSocialsLeaveAboutAnimations(data) {
    insertBackButton(data);
    await addActiveClassToNavBoxes(data);
    await insertNavBoxes(data);
    await insertSocialsColors(data);
}

async function enterHomeLeaveSocialsAnimations(data) {
    await insertNavBoxTexts(data.next.container, 3);
}
// =========================================================
// ==============      leaveViewAnimations      ==============
// =========================================================
async function leaveHomeAnimations(data) {
    const trigger = data.trigger;
    const triggerParent = trigger.parentElement;

    trigger.addEventListener('click', disableLink);
    blobity.focusElement(trigger);
    await removeNavBoxes(triggerParent, data);

    return insertTriggeredBox(data);
}

async function leaveHomeEnterProjectsAnimations(data) {
    const trigger = data.trigger;
    const triggerParent = trigger.parentElement;
    trigger.addEventListener('click', disableLink);

    await removeNavBoxes(triggerParent, data);
    await insertFullscreenBackground(data);
}

async function leaveHomeEnterSocialsAnimations(data) {
    await removeNavBoxTexts(data, 3);
}

async function leaveSocialsAnimations(data) {
    removeBackButton(data);
    await insertSocialsColorsTimeline.reverse();
}

async function removeNavBoxTexts(data, indexToAvoid = false) {
    const boxes = data ? data.current.container.querySelectorAll('#boxes .box') : document.querySelectorAll('#boxes .box');
    removeNavBoxTextsTimeline = gsap.timeline();

    boxes.forEach((item, index) => {
        if (index === indexToAvoid) {
            return;
        }
        // Add the animation to the timeline
        removeNavBoxTextsTimeline.to(item.querySelector('a'), 
            {
                opacity: 0,
                x: -30,
                duration: 0.3,
            },
            `0.${index}`
        );
    });

    return removeNavBoxTextsTimeline;
}

async function insertSocialsColors(data) {
    const boxes = data ? data.next.container.querySelectorAll('#boxes .box') : document.querySelectorAll('#boxes .box');
    insertSocialsColorsTimeline = gsap.timeline();

    insertSocialsColorsTimeline.to(boxes[0], {
        backgroundColor: '#FF9900',
        duration: 0.4
    })
    .to(boxes[0].querySelector('img'), {
        autoAlpha: 1,
        duration: 0.4
    }, 0)
    .to(boxes[1], {
        backgroundColor: '#0a66c2',
        duration: 0.4
    }, 0.1)
    .to(boxes[1].querySelector('img'), {
        autoAlpha: 1,
        duration: 0.4
    }, 0.1)
    .to(boxes[2], {
        backgroundColor: '#171515',
        duration: 0.4
    }, 0.2)
    .to(boxes[2].querySelector('img'), {
        autoAlpha: 1,
        duration: 0.4
    }, 0.2)

    return insertSocialsColorsTimeline;
}

async function addActiveClassToNavBoxes(data) {
    const boxes = data ? data.next.container.querySelectorAll('#boxes .box') : document.querySelectorAll('#boxes .box');
    boxes.forEach(item => {
        item.classList.add('active');
    });

    return;
}

// async function addActiveClassToNavBoxesTexts(data) {
//     const boxes = data ? data.next.container.querySelectorAll('#boxes .box a') : document.querySelectorAll('#boxes .box a');
//     boxes.forEach(item => {
//         item.classList.add('active');
//     });

//     return;
// }



async function leaveAboutAnimations(data) {
    insertAboutTextsTimeline.kill();
    removeBackButton(data);
    await removeAboutTexts(data);
}

async function leaveProjectsEnterHomeAnimations(data) {
    window.removeEventListener('keydown', flickityHandleKeydown);
    removeBackButton(data);
    await removeFlickityElements(data);
    await removeFlickity();
    await removeFullscreenBackground();
}
// =========================================================
// ==============         flickity         ==============
// =========================================================
async function removeFullscreenBackground() {

    if (typeof insertFullscreenBackgroundTimeline == 'undefined') {
        const bg = document.querySelector('#nav-text-mirror-container .nav-text-mirror:first-child');

        return gsap.fromTo(bg,
            {
                borderRadius: '50%'
            },
            {
                width: 0,
                height: 0,
                duration: 0.9,
                ease: "expo.out"
            }
        )
    }

    else {
        insertFullscreenBackgroundTimeline.reverse();
        const tl = gsap.timeline();
        const cont = document.querySelector('#nav-text-mirror-container');

        return tl.to(cont, {
            autoAlpha: 0,
            duration: 0.4,
            delay: 0.9,
            width: 0,
            height: 0,
            onComplete: () => {
                cont.classList.remove('initiated');
                Array.from(cont.children).forEach( (item, index) => {
                    if (index === 0) {
                        return;
                    }
                    item.remove();
                })
                insertFullscreenBackgroundTimeline.kill();
            }
        }).to(cont, {
            height: '100%',
            width: '100%',
            autoAlpha: 1,
            duration: 0
        }).to(cont, {
            height: 25,
            width: 25,
            autoAlpha: 1,
            duration: 0
        });
    }
}

async function removeFlickityElements(data) {
    removeFlickityTimeline = gsap.timeline();
    const easing = CustomEase.create("custom", "M0,0 C0.68,-0.6 0.09,0.9 1,1");
    const texts = data.current.container.querySelectorAll('.is-selected .will-animate');
    const controls = data.current.container.querySelectorAll('.init-animate');
    const mockups = data.current.container.querySelectorAll('#projects-slider .group');

    texts.forEach((item, index) => {
        removeFlickityTimeline.to(item, 
            
            {
                x: 300,
                ease: easing,
                duration: 1.15,
            }, index * 0.01,
        ).to(item, 
            {
                autoAlpha: 0,
                duration: 0.3,
            }, index * 0.01 + 0.3
        );
    });

    mockups.forEach((item, index) => {
        removeFlickityTimeline.to(item, {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.in',
        }, index * 0.03)
    });

    controls.forEach((item, index) => {
        removeFlickityTimeline.to(item, {
            autoAlpha: 0,
            y: 60,
            duration: 0.6,
            ease: easing
        }, index * 0.03)
    });

    return removeFlickityTimeline;
}

async function removeFlickity() {
    flickity.destroy();
}

async function addFlickity(element, data) {
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

    window.addEventListener('keydown', flickityHandleKeydown);

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

function flickityHandleKeydown(event) {
    if (event.key === 'ArrowLeft') {
        event.stopImmediatePropagation();
        document.getElementById('flickityPrev').dispatchEvent(new Event('click'));
    }

    if (event.key === 'ArrowRight') {
        event.stopImmediatePropagation();
        document.getElementById('flickityNext').dispatchEvent(new Event('click'));
    }
}

function flickityReadyAnimations(data) {
    data.next.container.querySelectorAll('.slide').forEach(item => {
        item.classList.add('initiated');
    });

    insertFlickityTimeline = gsap.timeline();
    const easing = CustomEase.create("custom", "M0,0 C0.68,-0.6 0.09,0.9 1,1");
    const elements = data.next.container.querySelectorAll('.init-animate');
    const mockup = data.next.container.querySelector('.mockups .group:first-child');

    elements.forEach((item, index) => {
        insertFlickityTimeline.fromTo(item,
            {
                y: 60
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: easing
            }, index * 0.03)
    })

    gsap.to(mockup, {
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
            mockup.classList.add('active');
        }
    });
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

function flickityIn(nextIndex, state = false) {
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

function flickityOut(currentIndex, state) {
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
// =========================================================
// ==============      animations      ==============
// =========================================================
async function insertFullscreenBackground(data) {
    insertFullscreenBackgroundTimeline = gsap.timeline();

    const trigger = data.trigger;
    const triggerParent = trigger.parentElement;

    // Used for creating staggered backgrounds
    const triggerParentMirrorContainer = document.getElementById('nav-text-mirror-container');
    const triggerParentMirror = triggerParentMirrorContainer.firstElementChild;

    const triggerParentWidth = triggerParent.offsetWidth;
    const triggerParentHeight = triggerParent.offsetHeight;

    const triggerParentComputedStyle = window.getComputedStyle(triggerParent);
    const triggerParentX = parseInt(triggerParentComputedStyle.getPropertyValue('left'));
    const triggerParentY = parseInt(triggerParentComputedStyle.getPropertyValue('top'));
    triggerParent.classList.add('non-interactive');

    let children;

    insertFullscreenBackgroundTimeline.to(trigger, {
        opacity: 0,
        duration: 0.3,
        ease: "power4.in"
    })
    .fromTo(triggerParent, 
        {
            x: -273.5,
            y: 0
        },
        {
        width: 25,
        height: 25,
        ease: 'power3.inOut',
        duration: 0.4,
        x: triggerParentX + (triggerParentWidth / 2) - (25 / 2),
        y: triggerParentY + (triggerParentHeight / 2) - (25 / 2)
    })
    // Add same position to the mirro container, which will make mix-blend-mode work
    .to(triggerParentMirror, {
        duration: 0,
        x: triggerParentX + (triggerParentWidth / 2) - (25 / 2),
        y: triggerParentY + (triggerParentHeight / 2) - (25 / 2)
    })
    .to(triggerParent, {
        borderRadius: '50%',
        duration: 0.2,
        ease: 'power3.inOut',
    }, '-=0.4')
    .to(triggerParent, {
        duration: 0.6,
        y: -50,
        repeat: 1,
        yoyo: true,
        onComplete: () => {
            triggerParent.remove();
            triggerParentMirrorContainer.classList.add('initiated');
            document.body.classList.add('black-bg');

            for (let i = 0; i < 5; i++) {
                const clone = triggerParentMirror.cloneNode(true);
                triggerParentMirrorContainer.appendChild(clone);
            }

            const wheight = vh(225);
            const wwidth = vw(225);
            const value = wwidth > wheight ? wwidth : wheight;

            children = Array.from(triggerParentMirrorContainer.children);

            children.forEach((child, index) => {
                const start = index == 0 ? 0 : 0.9 - (index * 0.02);

                insertFullscreenBackgroundTimeline.to(child, {
                    width: value,
                    height: value,
                    duration: 0.9,
                    x: -wwidth / 2,
                    y: -wheight / 2,
                    ease: "bounce.out"
                }, `-=${start}`)
            });
        }
    })

    trackDirection(insertFullscreenBackgroundTimeline);

    return insertFullscreenBackgroundTimeline;

}
async function drawLandingText() {
    const fontFileName = './assets/fonts/glitchgoblin.ttf';
    display(await fetch(fontFileName), fontFileName);
}

export function landingBoxesAnimation() {
    document.getElementById('snap').remove();
    document.body.classList.add('interactive');
    insertNavBoxTexts();
    insertTopNav();
    overlaySlider();
}

async function insertNavBoxTexts(dataContainer = false, indexToAvoid = false) {
    const boxes = dataContainer ? dataContainer.querySelectorAll('#boxes .box') : document.querySelectorAll('#boxes .box');
    insertNavBoxTextsTimeline = gsap.timeline();

    boxes.forEach((item, index) => {
        item.classList.add('active');
        
        if (indexToAvoid && indexToAvoid == index) {
            return;
        }

        // Add the animation to the timeline
        insertNavBoxTextsTimeline.fromTo(item.querySelector('a'), 
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.25,
            },
            `0.${index}`
        );
    });
    // document.querySelector('.no-animation').classList.remove();
}

// function appendHoverBox() {
//     const follower = document.getElementById('follower');

//     // Add event listener for mouse movement
//     document.addEventListener('mousemove', function(event) {
//         // Update the position of the follower div
//         follower.style.left = (event.clientX - follower.offsetWidth / 2) + 'px';
//         follower.style.top = (event.clientY - follower.offsetHeight / 2) - 50 + 'px';
//     });
// }



async function insertNavBoxes(data) {
    const boxes = data.next.container.querySelectorAll('#boxes .box');
    const boxesArray = Array.from(boxes).reverse();

    // Clear the timeline to avoid overlapping animations
    insertNavBoxesTimeline = gsap.timeline();

    boxesArray.forEach((item, index) => {
        const a = item.querySelector('a');

        // Add animations to the timeline
        insertNavBoxesTimeline.fromTo(item, 
            {
                x: -60,
                autoAlpha: 0
            },
            {
                x: 0,
                autoAlpha: 1,
                duration: 0.3,
                delay: `0.${index / 2}`,
                onComplete: () => {
                    item.classList.add('active');
                }
            },
            0
        );

        insertNavBoxesTimeline.fromTo(a, 
            {
                opacity: 0,
                x: -30
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.25,
                delay: `0.${index}`
            },
            `<`
        );
    });

    return insertNavBoxesTimeline;
}

async function insertTriggeredBox(data) {
    const triggerParent = data.trigger.parentElement;

    insertTriggeredBoxTween = gsap.to(triggerParent, {
        scale: 13,
        duration: 0.75,
    })

    return insertTriggeredBoxTween;
}


async function removeAboutTexts(data) {
    const texts = data.current.container.querySelectorAll('.animate-text');
    const textsArray = Array.from(texts).reverse();

    removeAboutTextsTimeline = gsap.timeline();

    // Add animations to the timeline
    textsArray.forEach((item, index) => {
        removeAboutTextsTimeline.to(item, {
            y: 60,
            opacity: 0,
            duration: 0.3,
            delay: `0.${index / 2}`
        }, `-=${index * 0.15}`);
    });

    return removeAboutTextsTimeline;
}

async function removeBackButton(data) {
    const button = data.current.container.querySelector('#back-link');

    removeBackButtonTween = gsap.to(button, {
        x: -40,
        opacity: 0,
        duration: 0.4,
        onStart: () => {
            button.classList.add('non-interactive');
        },
        onComplete: () => {
            button.classList.remove('non-interactive');
        }
    });

    return removeBackButtonTween;
}

async function insertBackButton(data) {
    const backButton = data.next.container.querySelector('#back-link');

    insertBackButtonTween = gsap.to(backButton, {
        opacity: 1,
        duration: 0.5,
    });

    return insertBackButtonTween;
}

async function insertAboutText(data) {
    const helloText = data.next.container.querySelector('#hello');
    const residencyText = data.next.container.querySelector('.residency-text');
    const contactText = data.next.container.querySelector('.contact-text');
    insertAboutTextsTimeline = gsap.timeline();

    insertAboutTextsTimeline.fromTo(helloText, 
        {
            y: 60
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power4.out",
            onComplete: () => {
                helloText.classList.add('interactive');
            }
        }
    );

    insertAboutTextsTimeline.fromTo(residencyText, 
        {
            y: 60
        },
        {
            delay: 0.4,
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power4.out",
            onComplete: () => {
                residencyText.classList.add('interactive');
            }
        }
    ).to(helloText, {
        y: -54,
        duration: 0.5, 
        ease: "power4.out"
    }, "-=0.5");

    insertAboutTextsTimeline.fromTo(contactText, 
        {
            y: 60
        },
        {
            delay: 0.7,
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power4.out",
            onComplete: () => {
                contactText.classList.add('interactive');
            }
        }
    ).to(helloText, {
        y: -84,
        duration: 0.5,
        ease: "power4.out"
    }, "-=0.6"
    ).to(residencyText, {
        y: -30,
        duration: 0.5,
        ease: "power4.out"
    }, "-=0.6");
}

async function removeTriggeredBox(data) {
    const trigger = data.trigger;
    trigger.style.zIndex = 1;

    removeTriggeredBoxTween = gsap.to(trigger, {
        scale: 0,
        duration: 0.5,
        onComplete: () => {
            trigger.removeEventListener('click', disableLink);
        }
    });

    return removeTriggeredBoxTween;
}

function insertLandingText(data) {
    const name = data.next.container.querySelector('#name');
    let drawLandingTextFlag = false;

    insertLandingTextTween = gsap.to(name, {
        y: "-50%",
        opacity: 1,
        delay: 0.8,
        duration: 1.5,
        ease: 'power4.out',
        onUpdate: function() {
            if (!drawLandingTextFlag && this.progress() >= 0.78) {
                drawLandingTextFlag = true;
            }
        },
        onComplete: () => {
            drawLandingText();
        }
    });

    return insertLandingTextTween;
}

async function removeNavBoxes(trigger, data) {
    const allBoxes = data.current.container.querySelectorAll('#boxes .box');
    const notTriggerBoxes = Array.from(allBoxes).filter(box => box !== trigger);
    removeNavBoxesTimeline = gsap.timeline();

    notTriggerBoxes.map((item, index) => {
        removeNavBoxesTimeline.to(item, {
            opacity: 0,
            x: 40,
            duration: 0.45,
            delay: `0.${index / 2}`
        }, 0);
    });

    return removeNavBoxesTimeline;
}

function insertTopNav() {
    insertTopNavTimeline = gsap.timeline();
    insertHomeLinkTimeline = gsap.timeline();

    const homelink = document.getElementById('home-link');
    const personalText = document.getElementById('personal-text');
    const portfolioText = document.getElementById('portfolio-text');
    const topLine = document.getElementById('top-line');
    const versionNumbering = document.getElementById('version-numbering');

    insertTopNavTimeline.to(personalText, {
        duration: 0.5,
        text: {
            value: "personal",
            padspace: true
        },
        ease: "none",
    });

    insertTopNavTimeline.to(portfolioText, {
        duration: 0.5,
        text: {
            value: "portfolio",
            padspace: true
        },
        ease: "none",
    });

    insertTopNavTimeline.to(topLine, {
        duration: 0.6,
        opacity: 1,
        height: 45,
        ease: "power2.out"
    });

    insertTopNavTimeline.to(versionNumbering, {
        duration: 0.3,
        opacity: 1,
        height: 45,
        text: {
            value: "v0.1 beta",
            padspace: true,
            rtl: true,
            speed: 0.5
        },
    }, "-=1.2");

    insertHomeLinkTimeline.fromTo(homelink, 
    {
        x: -vh(9)
    },
    {
        duration: 0.6,
        x: 0,
        ease: "power3.out",
    }).to(homelink, {
        delay: 0.15,
        duration: 0.6,
        opacity: 1,
        ease: "power3.out",
        onComplete: () => {
            homelink.classList.add('animated');
        }
    }, "-=0.45");
}

// async function leaveHomeAnimations(data) {
//     const navLinksPromise = animateNavLinks('leave', data);
//     const headlinePromise = animateHeadline('leave', data);

//     // Wait for all animation promises to resolve, including the headline animation
//     await Promise.all([navLinksPromise, headlinePromise]);
// }


// function animateNavLinks(state, data) {
//     const navLinks = gsap.utils.toArray('.nav-link');
//     const animationPromises = [];
    
//     // Map over each nav link and create a promise for each animation
//     navLinks.forEach((element, index) => {
//         // Create a promise for each animation
//         const animationPromise = new Promise(resolve => {
//             gsap.to(element, {
//                 duration: 1.15,
//                 delay: index * 0.2,
//                 ease: CustomEase.create("custom", "M0,0 C0.68,-0.6 0.09,0.9 1,1"),
//                 x: "-60vw",
//                 onUpdate: function() {
//                     // Check if the x animation is near completion
//                     if (this.progress() >= 0.30) {
//                         // Start opacity animation when x animation is near 30% completion
//                         gsap.to(element, {
//                             duration: 0.2,
//                             opacity: 0,
//                             ease: "power1.inOut"
//                         });
//                     }
//                 },
//                 onComplete: () => {
//                     data.next.container.querySelectorAll('.nav-link').forEach(element => {
//                         element.classList.add('slided-out');
//                     });
//                     resolve(); // Resolve the promise when the animation is complete
//                 }
//             });
//         });

//         // Push the promise to the array
//         animationPromises.push(animationPromise);
//     });

//     // Return a promise that resolves when all animations are completed
//     return Promise.all(animationPromises);
// }


// function animateHeadline(state, data) {
//     if (state == 'leave' && data.current.namespace === 'home') {
//         const currentHeadline = data.current.container.querySelector('.main-headline');
//         return gsap.to(currentHeadline, {
//             scale: 0.75,
//             y: -300,
//             duration: 1,
//             ease: 'elastic.out(1,1)',
//             onComplete: () => {
//                 data.next.container.querySelector('.main-headline').classList.add('positioned');
//             }
//         })
//     }

//     if (state == 'enter' && data.next.namespace === 'home') {
//         const nextHeadline = data.next.container.querySelector('.main-headline');
//         // Avoid staggered animations
//         nextHeadline.style.visibility = 'hidden';
//         return gsap.to(nextHeadline, {
//             scale: 1,
//             y: "-50%",
//             duration: 1,
//             ease: 'elastic.out(1,1)',
//             onComplete: () => {
//                 nextHeadline.classList.remove('positioned');
//                 nextHeadline.style.visibility = 'visible';
//                 nextHeadline.style.transform = 'translate(-50%, -50%)';
//             }
//         });
//     }
// }