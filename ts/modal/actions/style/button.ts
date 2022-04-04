import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../consts';

const paletteTopRight = document.createElementNS(SVG_NAMESPACE, 'path');

paletteTopRight.setAttribute('stroke-linecap', 'round');
paletteTopRight.setAttribute('stroke-width', '5');
paletteTopRight.setAttribute('d',
    'M 0,-50' +
    'Q 45,-45 50,0'
);

const paletteTopLeft = paletteTopRight.cloneNode(true) as SVGLineElement;

paletteTopLeft.setAttribute('transform', 'scale(-1,1)');

const paletteBottomLeft = paletteTopRight.cloneNode(true) as SVGLineElement;

paletteBottomLeft.setAttribute('transform', 'scale(-1,-1)');

const paletteBottomRight = document.createElementNS(SVG_NAMESPACE, 'path');

paletteBottomRight.setAttribute('fill', 'none');
paletteBottomRight.setAttribute('stroke-linecap', 'round');
paletteBottomRight.setAttribute('stroke-width', '5');
paletteBottomRight.setAttribute('d',
    'M 0,50' +
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

g.append(
    paletteTopRight, paletteTopLeft, paletteBottomLeft, paletteBottomRight,
    paint0, paint1, paint2, paint3
);

const BUTTON = getNewButton(g, ACTION_ID);

export default BUTTON;
