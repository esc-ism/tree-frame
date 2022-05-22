import {ACTION_ID, DISABLE_STROKE_CLASS} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../../../../consts';

const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

circle.setAttribute('cx', '70');
circle.setAttribute('cy', '70');
circle.setAttribute('r', '30');
circle.setAttribute('stroke-width', '10');

const line = document.createElementNS(SVG_NAMESPACE, 'line');

line.classList.add(DISABLE_STROKE_CLASS);

line.setAttribute('stroke-linecap', 'round');
line.setAttribute('stroke-width', '10');
line.setAttribute('x1', '40');
line.setAttribute('x2', '100');
line.setAttribute('y1', '70');
line.setAttribute('y2', '70');

line.setAttribute('transform', 'rotate(45 70 70)');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(circle, line);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Enabled');

export default BUTTON;
