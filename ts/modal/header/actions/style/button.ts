import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../../consts';

const CONTROL_POINT_OFFSET = 45;

const palette = document.createElementNS(SVG_NAMESPACE, 'path');

palette.setAttribute('stroke-linecap', 'round');
palette.setAttribute('stroke-width', '5');
palette.setAttribute('d',
    'M 50,0' +
    `Q ${CONTROL_POINT_OFFSET},-${CONTROL_POINT_OFFSET} 0,-50` +
    `Q -${CONTROL_POINT_OFFSET},-${CONTROL_POINT_OFFSET} -50,0` +
    `Q -${CONTROL_POINT_OFFSET},${CONTROL_POINT_OFFSET} 0,50` +
    'Q 16,50 20,45' +
    'Q 25,35 15,25' +
    'Q -5,10 15,2' +
    'Q 26,0 35,10' +
    'Q 48,20 50,0'
);

const paint0 = document.createElementNS(SVG_NAMESPACE, 'circle');

paint0.setAttribute('stroke-width', '0');
paint0.setAttribute('r', '9');
paint0.setAttribute('cx', '20');
paint0.setAttribute('cy', '-20');

const paint1 = paint0.cloneNode(true) as SVGLineElement;

paint1.setAttribute('cx', '-5');
paint1.setAttribute('cy', '-28');

const paint2 = paint0.cloneNode(true) as SVGLineElement;

paint2.setAttribute('cx', '-25');
paint2.setAttribute('cy', '-5');

const paint3 = paint0.cloneNode(true) as SVGLineElement;

paint3.setAttribute('cx', '-15');
paint3.setAttribute('cy', '22');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.setAttribute('transform', 'scale(0.95,0.95)');

g.append(palette, paint0, paint1, paint2, paint3);

const BUTTON = getNewButton(g, ACTION_ID);

export default BUTTON;
