import { drawLandingText } from '../utils/landing';
import { disableLink, vh, vw } from '../utils/helpers';
import { overlaySlider } from '../utils/overlay';

import { gsap } from 'gsap';
import { CustomEase } from "gsap/CustomEase";

export let insertModalResponsivenessTimeline;
let insertLandingTextTween;

export let insertSocialsColorsTimeline;

let removeNavBoxTextsTimeline;

let insertTriggeredBoxTween;
let removeTriggeredBoxTween;

let insertNavBoxesTimeline;
let removeNavBoxesTimeline;

let insertBackButtonTween;
let removeBackButtonTween;

export let insertAboutTextsTimeline;
let removeAboutTextsTimeline;

let insertFlickityTimeline;
let removeFlickityTimeline;

export let insertFullscreenBackgroundTimeline;
// let insertTriggeredBoxTween, removeTriggeredBoxTween;
// let insertFullscreenBackgroundTimeline;

let insertTopNavTimeline;
let insertHomeLinkTimeline;

let insertNavBoxTextsTimeline;

// let removeBackButtonTween, insertBackButtonTween;

// let insertNavBoxTextsTimeline, removeNavBoxTextsTimeline;
// let insertNavBoxesTimeline, removeNavBoxesTimeline;

// let insertFlickityTimeline, removeFlickityTimeline;
// let insertSocialsColorsTimeline;

// let insertAboutTextsTimeline, removeAboutTextsTimeline;

export function insertResponsivenessModal() {
    const templateDOM = document.getElementById('responsiveness-modal');
    const templateOverlay = templateDOM.querySelector('#responsiveness-modal-overlay');
    const templateContent = templateDOM.querySelector('#responsiveness-modal-content');
    insertModalResponsivenessTimeline = gsap.timeline();

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

export function insertLandingText(data) {
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

export function insertTopNav() {
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


export async function insertTriggeredBox(data) {
    const triggerParent = data.trigger.parentElement;

    insertTriggeredBoxTween = gsap.to(triggerParent, {
        scale: 13,
        duration: 0.75,
    })

    return insertTriggeredBoxTween;
}

export async function removeTriggeredBox(data) {
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

export async function addActiveClassToNavBoxes(data) {
    const boxes = data ? data.next.container.querySelectorAll('#boxes .box') : document.querySelectorAll('#boxes .box');
    boxes.forEach(item => {
        item.classList.add('active');
    });

    return;
}

export async function insertSocialsColors(data) {
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

export async function insertNavBoxes(data) {
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

export async function removeNavBoxes(trigger, data) {
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

export async function removeNavBoxTexts(data, indexToAvoid = false) {
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

export async function insertBackButton(data) {
    const backButton = data.next.container.querySelector('#back-link');

    insertBackButtonTween = gsap.to(backButton, {
        opacity: 1,
        duration: 0.5,
    });

    return insertBackButtonTween;
}

export async function removeBackButton(data) {
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


export async function insertAboutText(data) {
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

export async function removeAboutTexts(data) {
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

export function landingBoxesAnimation() {
    document.getElementById('snap').remove();
    document.body.classList.add('interactive');
    insertNavBoxTexts();
    insertTopNav();
    overlaySlider();
}

export async function insertNavBoxTexts(dataContainer = false, indexToAvoid = false) {
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
}

export function flickityReadyAnimations(data) {
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

export async function removeFlickityElements(data) {
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

export async function insertFullscreenBackground(data) {
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

    // trackDirection(insertFullscreenBackgroundTimeline);

    return insertFullscreenBackgroundTimeline;

}

export async function removeFullscreenBackground() {

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