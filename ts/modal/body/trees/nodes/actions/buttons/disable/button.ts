import {ACTION_ID_ALT, ACTION_ID_DEFAULT} from './consts';

import {ALT_CLASS} from '../consts';
import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const gDefault = (() => {
    const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

    circle.setAttribute('r', '30');
    circle.setAttribute('stroke-width', '10');

    const line = document.createElementNS(SVG_NAMESPACE, 'line');

    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-width', '10');
    line.setAttribute('x1', '-30');
    line.setAttribute('x2', '30');

    line.setAttribute('transform', 'rotate(45)');

    const g = document.createElementNS(SVG_NAMESPACE, 'g');

    g.append(circle, line);

    return g;
})();

export const BUTTON_DEFAULT = getNewButton(gDefault, ACTION_ID_DEFAULT, 'Toggle Enabled');

const gAlt = (() => {
    const line0 = document.createElementNS(SVG_NAMESPACE, 'line');

    line0.setAttribute('stroke-linecap', 'round');
    line0.setAttribute('stroke-width', '12');
    line0.setAttribute('x1', '-20');
    line0.setAttribute('x2', '20');
    line0.setAttribute('y1', '-20');
    line0.setAttribute('y2', '20');

    const line1 = line0.cloneNode(true) as SVGLineElement;

    line1.setAttribute('transform', 'rotate(90)');

    const g = document.createElementNS(SVG_NAMESPACE, 'g');

    g.append(line0, line1);

    return g;
})();

export const BUTTON_ALT = getNewButton(gAlt, ACTION_ID_ALT, 'Delete');

BUTTON_ALT.classList.add(ALT_CLASS);
