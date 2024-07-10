import {ACTION_ID} from './consts';

import {getPositionedButton} from '../position/button/alt';

import {SVG_NAMESPACE} from '@/modal/consts';

const RADIUS = 15;
const HEIGHT = 25;
const WIDTH = 10;

const outline0 = document.createElementNS(SVG_NAMESPACE, 'path');

outline0.setAttribute('stroke-linecap', 'round');
outline0.setAttribute('stroke-width', '8');
outline0.setAttribute('fill', 'none');
outline0.setAttribute('d',
	`M ${WIDTH / 2 + RADIUS} ${-HEIGHT / 2}`
	+ `q 0,-${RADIUS} -${RADIUS},-${RADIUS}`
	+ `h -${WIDTH}`
	+ `q -${RADIUS},0 -${RADIUS},${RADIUS}`
	+ `v ${HEIGHT}`
	+ `q 0,${RADIUS} ${RADIUS},${RADIUS}`,
);
outline0.setAttribute('transform', `translate(-${RADIUS / 2}, -${RADIUS / 2})`);

const outline1 = document.createElementNS(SVG_NAMESPACE, 'path');

outline1.setAttribute('stroke-linecap', 'round');
outline1.setAttribute('stroke-width', '8');
outline1.setAttribute('fill', 'none');
outline1.setAttribute('d',
	`M ${WIDTH / 2 + RADIUS} ${-HEIGHT / 2}`
	+ `q 0,-${RADIUS} -${RADIUS},-${RADIUS}`
	+ `h -${WIDTH}`
	+ `q -${RADIUS},0 -${RADIUS},${RADIUS}`
	+ `v ${HEIGHT}`
	+ `q 0,${RADIUS} ${RADIUS},${RADIUS}`
	+ `h ${WIDTH}`
	+ `q ${RADIUS},0 ${RADIUS},-${RADIUS}`
	+ `v -${HEIGHT}`,
);
outline1.setAttribute('transform', `translate(${RADIUS / 2}, ${RADIUS / 2})`);

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.setAttribute('transform', `rotate(10)`);

g.append(outline0, outline1);

const BUTTON = getPositionedButton(g, ACTION_ID, 'Duplicate', {scale: 0.6, translate: '10 16', rotate: 10});

export default BUTTON;
