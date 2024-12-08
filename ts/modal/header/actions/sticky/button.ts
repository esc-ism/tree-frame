import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const handle = document.createElementNS(SVG_NAMESPACE, 'path');

const HANDLE_WIDTH = 50;
const CURVE_RADIUS = 10;

handle.setAttribute('stroke-width', '7');
handle.setAttribute('d',
	`M ${-HANDLE_WIDTH / 2} -40`
	+ `q 0 ${CURVE_RADIUS} ${CURVE_RADIUS} ${CURVE_RADIUS}`
	+ `q ${CURVE_RADIUS / 2} ${CURVE_RADIUS * 1.5} 0 ${CURVE_RADIUS * 3}`
	+ `q ${-CURVE_RADIUS} 0 ${-CURVE_RADIUS} ${CURVE_RADIUS}`
	+ `l ${HANDLE_WIDTH} 0`
	+ `q 0 ${-CURVE_RADIUS} ${-CURVE_RADIUS} ${-CURVE_RADIUS}`
	+ `q ${-CURVE_RADIUS / 2} ${-CURVE_RADIUS * 1.5} 0 ${-CURVE_RADIUS * 3}`
	+ `q ${CURVE_RADIUS} 0 ${CURVE_RADIUS} ${-CURVE_RADIUS}`
	+ 'Z',
);

const point = document.createElementNS(SVG_NAMESPACE, 'path');

point.setAttribute('fill', 'none');
point.setAttribute('stroke-width', '4');
point.setAttribute('d',
	'M -2,-20'
	+ 'l 0 50'
	+ 'l 2 20'
	+ 'l 2 -20'
	+ 'l 0 -50Z',
);

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(point, handle);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Sticky');

export default BUTTON;
