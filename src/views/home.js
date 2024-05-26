import { insertLandingText, insertTriggeredBox, removeNavBoxes, insertNavBoxes, insertNavBoxTexts, removeNavBoxTexts } from '../animations/animations';
import { disableLink } from '../utils/helpers';
import { blobity } from '../app';
export const homeView = {
    namespace: 'home',
    beforeEnter(data) {
        if (!data.current.container) {
            beforeEnterHome(data);
        }
    }
}

function beforeEnterHome(data) {
    insertLandingText(data);
    //landingBoxesAnimation(data); // TODO: remove this line. include above again.
}

export async function enterHomeAnimations(data) {
    await insertNavBoxes(data);
}

export async function enterHomeLeaveSocialsAnimations(data) {
    await insertNavBoxTexts(data.next.container, 3);
}

export async function leaveHomeEnterSocialsAnimations(data) {
    await removeNavBoxTexts(data, 3);
}

export async function leaveHomeAnimations(data) {
    const trigger = data.trigger;
    const triggerParent = trigger.parentElement;

    trigger.addEventListener('click', disableLink);
    blobity.focusElement(trigger);
    await removeNavBoxes(triggerParent, data);

    return insertTriggeredBox(data);
}