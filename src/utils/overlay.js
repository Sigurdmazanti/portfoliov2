import { removeItemFromArray } from '../utils/helpers';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function overlaySlider() {
    const colorElements = gsap.utils.toArray('#bgOverlayHolder .color');
    const colors = [
        "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)", // blue sky
        "linear-gradient(62deg, #FBAB7E 0%, #F7CE68 100%)",  // orange
        "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)", // blue
        "linear-gradient(132deg, #F4D03F 0%, #16A085 100%)", // green
        "linear-gradient(90deg, #FAD961 0%, #F76B1C 100%)",  // sunset
        "radial-gradient( circle farthest-corner at 17.1% 22.8%, rgba(226,24,24,1) 0%, rgba(160,6,6,1) 90% )", // red
        "linear-gradient(to right, #1d4350, #a43931)", // gray/red
        "linear-gradient( 135deg, #F05F57 10%, #360940 100%)",
        "linear-gradient( 135deg, #97ABFF 10%, #123597 100%)",
        "linear-gradient( 135deg, #3B2667 10%, #BC78EC 100%)",
        "linear-gradient( 135deg, #FF96F9 10%, #C32BAC 100%)"
    ];
    // Iterate over each color element and apply animations
    colorElements.forEach((element, index) => {

        // Skip first iteration to keep initial background color
        if (index == 0) {
            return;
        }
        const color = gsap.utils.random(colors);
        element.style.backgroundImage = color;
        removeItemFromArray(colors, color);
    });

    let isScrolling = false;
    const scrollThreshold = 30;

    ScrollTrigger.observe({
        target: window,
        type: "wheel, touch",
        scrub: true,
        end: "bottom bottom",
        onUp: (e) => {
            const deltaY = e.deltaY || e.detail || e.wheelDelta;

            if ( !isScrolling && Math.abs(deltaY) >= scrollThreshold ) {
                isScrolling = true;
            
                const activeIndex = colorElements.findIndex(element => element.classList.contains('active'));
                const prevIndex = activeIndex - 1;
                const isResetButtonActive = document.getElementById('resetOverlay').classList.contains('active') ? true : false;

                if ( prevIndex < 0 ) {
                    isScrolling = false;
                    return;
                }

                onScrollAnimate(colorElements, activeIndex, 'up');

                if ( isResetButtonActive && prevIndex == 0 ) {
                    overlayAnimateResetButton(isResetButtonActive);
                }

                setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        },
        onDown: (e) => {
            const deltaY = e.deltaY || e.detail || e.wheelDelta;

            if ( !isScrolling && Math.abs(deltaY) >= scrollThreshold ) {
                const activeIndex = colorElements.findIndex(element => element.classList.contains('active'));
                const nextIndex = activeIndex + 1;
                const isResetButtonActive = document.getElementById('resetOverlay').classList.contains('active') ? true : false;

                // Check if there are any more overlays available
                if (nextIndex + 1 > colorElements.length) {
                    return;
                }

                isScrolling = true;
                onScrollAnimate(colorElements, activeIndex, 'down');

                if ( !isResetButtonActive ) {
                    overlayAnimateResetButton(isResetButtonActive);
                }

                setTimeout(() => {
                    isScrolling = false;
                }, 500);
            }
        }
    });

    overlayResetButton();
}

export function overlayResetButton() {
    const resetButton = document.getElementById('resetOverlay');

    if ( !resetButton ) {
        return;
    }

    resetButton.addEventListener('click', function() {
        const colorElements = gsap.utils.toArray('#bgOverlayHolder .color');
        const activeIndex = 1; // set to 1 to reset
        onScrollAnimate(colorElements, activeIndex, 'up');
        overlayAnimateResetButton(true);
    });
}

export function overlayAnimateResetButton(buttonState) {
    const button = document.getElementById('resetOverlay');
 
    if (buttonState === true) {
        gsap.to(button, {
            ease: "power2.out",
            duration: 0.3,
            bottom: -45,
            onComplete: () => {
                button.classList.remove('active');
            }
        })

        return;
    }

    gsap.to(button, {
        ease: "elastic.out(1,0.5)",
        duration: 0.8,
        bottom: 45,
        onComplete: () => {
            button.classList.add('active');
        }
    })
}

export function onScrollAnimate(colorElements, activeIndex, direction) {
    const indexChange = direction === 'down' ? 1 : -1;
    const activeIndexMultiplier = activeIndex + indexChange;

    colorElements.forEach((element, index) => {
        gsap.to(colorElements[index], {
            ease: "power2.out",
            duration: 0.6,
            y: `-${activeIndexMultiplier * 100}%`,
        });

        if (index == activeIndex) {
            colorElements[activeIndex].classList.remove('active');
            colorElements[activeIndexMultiplier].classList.add('active');
        }
    });
}