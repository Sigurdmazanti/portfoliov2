import { preventSameUrlRedirect } from "../utils/eventListeners";
import { 
    insertBackButton, removeBackButton, insertTopNav, 
    insertNavBoxes, addActiveClassToNavBoxes, insertSocialsColors,
    insertSocialsColorsTimeline
} from "../animations/animations";

export const socialsView = {
    namespace: 'socials',
    beforeEnter(data) {
        preventSameUrlRedirect();

        if (!data.current.container) {
            beforeEnterSocials(data);
        }
    }
}

async function beforeEnterSocials(data) {
    document.body.classList.add('interactive');
    insertBackButton(data);
    insertTopNav(data);
    await insertNavBoxes(data);
    await addActiveClassToNavBoxes(data);
    await insertSocialsColors(data);
}

export async function enterSocialsAnimations(data) {
    insertBackButton(data);
    await addActiveClassToNavBoxes(data);
    await insertSocialsColors(data);
}

export async function enterSocialsLeaveAboutAnimations(data) {
    insertBackButton(data);
    await addActiveClassToNavBoxes(data);
    await insertNavBoxes(data);
    await insertSocialsColors(data);
}

export async function leaveSocialsAnimations(data) {
    removeBackButton(data);
    await insertSocialsColorsTimeline.reverse();
}