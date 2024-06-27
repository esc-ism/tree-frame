import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const edgeTop = document.createElementNS(SVG_NAMESPACE, 'path');

edgeTop.setAttribute('stroke-linecap', 'round');
edgeTop.setAttribute('stroke-width', '6');
edgeTop.setAttribute('d',
	'M -55, 0'
	+ 'Q 0,80 55,0',
);
edgeTop.setAttribute('fill', 'none');

const edgeBottom = edgeTop.cloneNode(true) as SVGLineElement;

edgeBottom.setAttribute('transform', 'scale(1,-1)');

const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

circle.setAttribute('cx', '0');
circle.setAttribute('cy', '0');
circle.setAttribute('r', '26');
circle.setAttribute('stroke-width', '7');

const line = document.createElementNS(SVG_NAMESPACE, 'line');

line.setAttribute('stroke-linecap', 'round');
line.setAttribute('stroke-width', '7');
line.setAttribute('x1', '-26');
line.setAttribute('x2', '26');
line.setAttribute('y1', '0');
line.setAttribute('y2', '0');

line.setAttribute('transform', 'rotate(45 0 0)');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(
	edgeTop, edgeBottom,
	circle, line,
);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Disabled Node Visibility');

export default BUTTON;
