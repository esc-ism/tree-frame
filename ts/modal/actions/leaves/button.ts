import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../consts';

const edgeLeft = document.createElementNS(SVG_NAMESPACE, 'path');

edgeLeft.setAttribute('stroke-linecap', 'round');
edgeLeft.setAttribute('stroke-width', '6');
edgeLeft.setAttribute('d',
    'M 1,-55' +
    'C -50,30 -20,30 1,40'
);

const edgeRight = edgeLeft.cloneNode(true) as SVGLineElement;

edgeRight.setAttribute('transform', 'scale(-1,1)');

const lineVertical = document.createElementNS(SVG_NAMESPACE, 'line');

lineVertical.setAttribute('stroke-linecap', 'round');
lineVertical.setAttribute('stroke-width', '6');
lineVertical.setAttribute('x1', '0');
lineVertical.setAttribute('x2', '0');
lineVertical.setAttribute('y1', '50');
lineVertical.setAttribute('y2', '-12');

const lineHorizontal0 = document.createElementNS(SVG_NAMESPACE, 'line');

lineHorizontal0.setAttribute('stroke-linecap', 'round');
lineHorizontal0.setAttribute('stroke-width', '4');
lineHorizontal0.setAttribute('x1', '0');
lineHorizontal0.setAttribute('x2', '10');
lineHorizontal0.setAttribute('y1', '5');
lineHorizontal0.setAttribute('y2', '-5');

const lineHorizontal1 = lineHorizontal0.cloneNode(true) as SVGLineElement;

lineHorizontal1.setAttribute('x2', `-${lineHorizontal1.getAttribute('x2')}`);

const lineHorizontal2 = lineHorizontal0.cloneNode(true) as SVGLineElement;

lineHorizontal2.setAttribute('transform', 'translate(0,20), scale(1.3, 1.2)');

const lineHorizontal3 = lineHorizontal2.cloneNode(true) as SVGLineElement;

lineHorizontal3.setAttribute('x2', `-${lineHorizontal3.getAttribute('x2')}`);

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(
    edgeLeft, edgeRight, lineVertical,
    lineHorizontal0, lineHorizontal1,
    lineHorizontal2, lineHorizontal3
);

const BUTTON = getNewButton(g, ACTION_ID);

export default BUTTON;
