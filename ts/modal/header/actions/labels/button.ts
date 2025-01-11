import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const outline = document.createElementNS(SVG_NAMESPACE, 'path');

outline.setAttribute('stroke-linecap', 'round');
outline.setAttribute('stroke-width', '7');
outline.setAttribute('d',
	'M 20 -30'
	+ ' L -40 -30'
	+ ' L -40 30'
	+ ' L 20 30'
	+ ' L 50 0'
	+ ' L 20 -30',
);

const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

circle.setAttribute('stroke-width', '5');
circle.setAttribute('r', '5');
circle.setAttribute('cx', '20');
circle.setAttribute('cy', '0');

const loop = document.createElementNS(SVG_NAMESPACE, 'path');

loop.setAttribute('fill', 'none');
loop.setAttribute('stroke-linecap', 'round');
loop.setAttribute('stroke-width', '6');
loop.setAttribute('d',
	'M 20 0'
	+ ' C -70 50 -30 50 15 30',
);

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.setAttribute('transform', 'rotate(-60 0 0)');

g.append(outline, circle, loop);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Labels');

export default BUTTON;
