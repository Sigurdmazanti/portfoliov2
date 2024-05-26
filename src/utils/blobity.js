
import Blobity from 'blobity';

export function addBlobity() {
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