import { addBlobity } from './utils/blobity';
import { waitForNextNamespace } from './utils/helpers';
import { responsivenessModal } from './utils/modal';
import { addResizeListener, preventSameUrlRedirect } from './utils/eventListeners';

import { 
    homeView, enterHomeAnimations, enterHomeLeaveSocialsAnimations, 
    leaveHomeEnterSocialsAnimations, leaveHomeAnimations
} from './views/home';

import { 
    aboutView, enterAboutAnimations, leaveAboutAnimations 
} from './views/about';

import { 
    projectsView, enterProjectsAnimations, leaveHomeEnterProjectsAnimations,
    leaveProjectsAnimations 
} from './views/projects';

import { 
    socialsView, enterSocialsAnimations, enterSocialsLeaveAboutAnimations,
    leaveSocialsAnimations
} from './views/socials';


import barba from '@barba/core';
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin,CustomEase);
// =========================================================
// ================        General          ================
// =========================================================
export let blobity;

document.addEventListener('DOMContentLoaded', function() { 
    blobity = addBlobity();
    preventSameUrlRedirect();
    responsivenessModal();
    addResizeListener(responsivenessModal);
});
// =========================================================
// ==============     Barba initialization    ==============
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
                    await leaveProjectsAnimations(data);
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