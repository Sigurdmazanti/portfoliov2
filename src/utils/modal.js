import { insertModalResponsivenessTimeline, insertResponsivenessModal } from '../animations/animations';
import { removeResizeListener } from './eventListeners';

export function responsivenessModal() {
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

    document.querySelectorAll('.close-modal').forEach((item) => {
        item.addEventListener('click', () => {
            sessionStorage.setItem('modal-closed', 'true');
            removeResizeListener();
            insertModalResponsivenessTimeline.reverse();
        });
    });

    insertResponsivenessModal();
    return insertModalResponsivenessTimeline;
}
