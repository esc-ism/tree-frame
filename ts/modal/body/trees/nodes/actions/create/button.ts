import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../../../../consts';

const lineHorizontal = document.createElementNS(SVG_NAMESPACE, 'line');

lineHorizontal.setAttribute('stroke-linecap', 'round');
lineHorizontal.setAttribute('stroke-width', '12');
lineHorizontal.setAttribute('x1', '40');
lineHorizontal.setAttribute('x2', '100');
lineHorizontal.setAttribute('y1', '70');
lineHorizontal.setAttribute('y2', '70');

const lineVertical = lineHorizontal.cloneNode(true) as SVGLineElement;

lineVertical.setAttribute('transform', 'rotate(90 70 70)');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(lineHorizontal, lineVertical);

const BUTTON = getNewButton(g, ACTION_ID, 'Create');

export default BUTTON;
