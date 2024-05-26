import { 
    insertBackButton, removeBackButton, insertAboutText, removeAboutTexts,
    insertTopNav, removeTriggeredBox, insertAboutTextsTimeline
} from '../animations/animations';
import { overlaySlider } from './../utils/overlay'

export const aboutView = {
    namespace: 'about',
    beforeEnter(data) {
        if(!data.current.container) {
            beforeEnterAbout(data);
        }
    }
}

export async function enterAboutAnimations(data) {
    await removeTriggeredBox(data);
    insertBackButton(data);
    insertAboutText(data);
}

export async function leaveAboutAnimations(data) {
    insertAboutTextsTimeline.kill();
    removeBackButton(data);
    await removeAboutTexts(data);
}

function beforeEnterAbout(data) {
    document.body.classList.add('interactive');
    insertBackButton(data);
    insertAboutText(data);
    insertTopNav();
    overlaySlider();
}