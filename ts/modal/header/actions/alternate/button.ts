import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const ALPHA = (2 * Math.PI) / 10;
const RADIUS = 46;

const points: number[][] = [];

// https://stackoverflow.com/questions/14580033/algorithm-for-drawing-a-5-point-star
for (let i = 0; i < 12; ++i) {
    const r = RADIUS * (i % 2 + 1) / 2;
    const omega = ALPHA * i;

    points.push([r * Math.sin(omega), r * Math.cos(omega)]);
}

const outline = document.createElementNS(SVG_NAMESPACE, 'path');

outline.setAttribute('stroke-linecap', 'round');
outline.setAttribute('stroke-width', '7');
outline.setAttribute('d', points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join());

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(outline);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Special Buttons');

export default BUTTON;
