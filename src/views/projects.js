import { 
    insertBackButton, insertTopNav, removeNavBoxes,
    insertFullscreenBackground, removeFullscreenBackground, removeBackButton,
    removeFlickityElements
} from '../animations/animations';
import { addFlickity, flickityIn, removeFlickity } from '../utils/flickity';
import { disableLink } from '../utils/helpers';
import { removeFlickityKeydownListener } from '../utils/eventListeners'

export const projectsView = {
    namespace: 'projects',
    beforeEnter(data) {
        if(!data.current.container) {
            beforeEnterProjects(data);
        }
    }
};

async function beforeEnterProjects(data) {
    document.body.classList.add('interactive');
    document.body.classList.add('black-bg');
    document.getElementById('nav-text-mirror-container').classList.add('landed');
    insertBackButton(data);
    insertTopNav(data);
    await addFlickity(data.next.container.querySelector('#projects-slider'), data);
    flickityIn(0, 'init');
}

export async function enterProjectsAnimations(data) {
    addFlickity(data.next.container.querySelector('#projects-slider'), data);
    insertBackButton(data);
    flickityIn(0, 'init');
}

export async function leaveHomeEnterProjectsAnimations(data) {
    const trigger = data.trigger;
    const triggerParent = trigger.parentElement;
    trigger.addEventListener('click', disableLink);

    await removeNavBoxes(triggerParent, data);
    await insertFullscreenBackground(data);
}

export async function leaveProjectsAnimations(data) {
    removeFlickityKeydownListener();
    removeBackButton(data);
    await removeFlickityElements(data);
    await removeFlickity();
    await removeFullscreenBackground();
}