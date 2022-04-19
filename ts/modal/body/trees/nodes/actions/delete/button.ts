import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../../../../consts';

const lineVertical0 = document.createElementNS(SVG_NAMESPACE, 'line');

lineVertical0.setAttribute('stroke-linecap', 'square');
lineVertical0.setAttribute('stroke-width', '5');
lineVertical0.setAttribute('x1', '52');
lineVertical0.setAttribute('x2', '52');
lineVertical0.setAttribute('y1', '57');
lineVertical0.setAttribute('y2', '95');

const lineVertical1 = lineVertical0.cloneNode(true) as SVGLineElement;

lineVertical1.setAttribute('transform', `translate(12 5)`);

const lineVertical2 = lineVertical1.cloneNode(true) as SVGLineElement;

lineVertical2.setAttribute('transform', `translate(24 5)`);

const lineVertical3 = lineVertical2.cloneNode(true) as SVGLineElement;

lineVertical3.setAttribute('transform', `translate(36 0)`);

const curveBottom = document.createElementNS(SVG_NAMESPACE, 'path');

curveBottom.setAttribute('fill', 'none');
curveBottom.setAttribute('stroke-linecap', 'round');
curveBottom.setAttribute('stroke-width', '5');
curveBottom.setAttribute('d',
    'm 52,98' +
    'c12,6 24,6 36,0'
);

const curveTop0 = curveBottom.cloneNode(true) as SVGPathElement;

curveTop0.setAttribute('transform', 'translate(0 -43)');

const curveTop1 = document.createElementNS(SVG_NAMESPACE, 'path');

curveTop1.setAttribute('fill', 'none');
curveTop1.setAttribute('stroke-linecap', 'round');
curveTop1.setAttribute('stroke-width', '5');
curveTop1.setAttribute('d',
    'm 52,54' +
    'c 4,-2 8,-4 12,-4'
);

const lid = document.createElementNS(SVG_NAMESPACE, 'ellipse');

lid.setAttribute('cx', '56.5');
lid.setAttribute('cy', '50.3');
lid.setAttribute('rx', '18.2');
lid.setAttribute('ry', '4.2');
lid.setAttribute('stroke-linecap', 'round');
lid.setAttribute('stroke-width', '5');
lid.setAttribute('fill', 'none');
lid.setAttribute('transform', 'rotate(20 70 90)');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(lineVertical0, lineVertical1, lineVertical2, lineVertical3, curveBottom, curveTop0, curveTop1, lid);

const BUTTON = getNewButton(g, ACTION_ID, 'Delete');

export default BUTTON;
