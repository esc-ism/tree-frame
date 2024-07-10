import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const edgeTop = document.createElementNS(SVG_NAMESPACE, 'path');

edgeTop.setAttribute('stroke-linecap', 'round');
edgeTop.setAttribute('stroke-width', '7');
edgeTop.setAttribute('d',
	'M -55, 0'
	+ 'Q 0,60 55,0',
);
edgeTop.setAttribute('fill', 'none');

const edgeBottom = edgeTop.cloneNode(true) as SVGLineElement;

edgeBottom.setAttribute('transform', 'scale(1,-1)');

const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

circle.setAttribute('cx', '0');
circle.setAttribute('cy', '0');
circle.setAttribute('r', '26');
circle.setAttribute('stroke-width', '6');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(
	edgeTop, edgeBottom,
	circle,
);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Disabled Node Visibility');

export default BUTTON;
