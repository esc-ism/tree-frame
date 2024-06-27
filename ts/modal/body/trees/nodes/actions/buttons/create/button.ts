import {ACTION_ID} from './consts';

import {getPositionedButton} from '../position/button/alt';

import {SVG_NAMESPACE} from '@/modal/consts';

const lineHorizontal = document.createElementNS(SVG_NAMESPACE, 'line');

lineHorizontal.setAttribute('stroke-linecap', 'round');
lineHorizontal.setAttribute('stroke-width', '12');
lineHorizontal.setAttribute('x1', '-25');
lineHorizontal.setAttribute('x2', '25');

const lineVertical = lineHorizontal.cloneNode(true) as SVGLineElement;

lineVertical.setAttribute('transform', 'rotate(90)');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(lineHorizontal, lineVertical);

const BUTTON = getPositionedButton(g, ACTION_ID, 'Create', {scale: '1 1.15'});

export default BUTTON;
