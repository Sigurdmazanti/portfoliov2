import { throttleDebounce }      from './helpers';
import { landingBoxesAnimation } from  '../animations/animations';
import * as opentype from 'opentype.js';

export async function drawLandingText() {
    const fontFileName = './assets/fonts/glitchgoblin.ttf';
    display(await fetch(fontFileName), fontFileName);
}

export function doSnap(path, str, dist, snX, snY) {
    const layers = path._layers;
    if ( layers && layers.length ) {
        for( let l = 0; l < layers.length; l++ ) {
            doSnap(layers[l]);
        }
        return;
    }
    const snap = (v, distance, strength) => (v * (1.0 - strength)) + (strength * Math.round(v / distance) * distance);
    const strength = str;
    const snapDistance = dist;
    const snapX = snX;
    const snapY = snY;

    for (let i = 0; i < path.commands.length; i++) {
        var cmd = path.commands[i];
        if (cmd.type !== 'Z') {
            cmd.x = snap(cmd.x + snapX, snapDistance, strength) - snapX;
            cmd.y = snap(cmd.y + snapY, snapDistance, strength) - snapY;
        }
        if (cmd.type === 'Q' || cmd.type === 'C') {
            cmd.x1 = snap(cmd.x1 + snapX, snapDistance, strength) - snapX;
            cmd.y1 = snap(cmd.y1 + snapY, snapDistance, strength) - snapY;
        }
        if (cmd.type === 'C') {
            cmd.x2 = snap(cmd.x2 + snapX, snapDistance, strength) - snapX;
            cmd.y2 = snap(cmd.y2 + snapY, snapDistance, strength) - snapY;
        }
    }
}

let renderCount = 0;

export function renderText(i = 0, count) {
    const font = window.font;
    if (!font) return;

    if (i === 1) {
        document.getElementById('name').remove();
    }

    if (i === count) {
        clearInterval(intervalId);
        landingBoxesAnimation();
        return;
    }
    
    drawText(font, i);
    renderCount++;
}

export function drawText(font, index) {
    const textToRender = 'mazanti';
    const fontSize = 150;

    const snapPath = font.getPath(textToRender, 0, 200, fontSize);
    doSnap(snapPath, 1, index, -100, 100);
    var snapCtx = document.getElementById('snap').getContext('2d');
    snapCtx.clearRect(0, 0, 940, 300);
    snapPath.draw(snapCtx);
}

const intervalId = setInterval(() => {
    renderText(renderCount, 62); // Pass the render count to the function
}, 45);

window.throttledRedraw = throttleDebounce((...args) => {
    window.redraw(...args);
}, 50);

export function enableHighDPICanvas(canvas) {
    if (typeof canvas === 'string') {
        canvas = document.getElementById(canvas);

        if (!canvas) { return false; }
    }

    var pixelRatio = window.devicePixelRatio || 1;
    if (pixelRatio === 1) return;
    var oldWidth = canvas.width;
    var oldHeight = canvas.height;
    canvas.width = oldWidth * pixelRatio;
    canvas.height = oldHeight * pixelRatio;
    canvas.style.width = oldWidth + 'px';
    canvas.style.height = oldHeight + 'px';
    canvas.getContext('2d').scale(pixelRatio, pixelRatio);
}

export function onFontLoaded(font) {
    if (window.font) {
        window.font.onGlyphUpdated = null
    }
    window.font = font;

    renderText();
}

export async function display(file) {
    try {
        const data = await file.arrayBuffer();
        onFontLoaded(opentype.parse(data, { lowMemory: true }));
    } catch (err) {
        console.error(err);
    }
}

enableHighDPICanvas('snap');