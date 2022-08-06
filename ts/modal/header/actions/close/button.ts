import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const line0 = document.createElementNS(SVG_NAMESPACE, 'line');

line0.setAttribute('stroke-linecap', 'round');
line0.setAttribute('stroke-width', '12');
line0.setAttribute('x1', '-30');
line0.setAttribute('x2', '30');
line0.setAttribute('y1', '-30');
line0.setAttribute('y2', '30');

const line1 = line0.cloneNode(true) as SVGLineElement;

line1.setAttribute('transform', 'rotate(90 0 0)');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(line0, line1);

const BUTTON = getNewButton(g, ACTION_ID, 'Save & Exit');

export default BUTTON;
