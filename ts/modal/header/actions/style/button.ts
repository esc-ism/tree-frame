import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../../consts';

const handle = document.createElementNS(SVG_NAMESPACE, 'rect');

handle.setAttribute('stroke-linecap', 'round');
handle.setAttribute('stroke-width', '6');
handle.setAttribute('x', '-5');
handle.setAttribute('y', '15');
handle.setAttribute('width', '15');
handle.setAttribute('height', '40');
handle.setAttribute('rx', '5');

const frame = document.createElementNS(SVG_NAMESPACE, 'path');

frame.setAttribute('fill', 'none');
frame.setAttribute('stroke-linecap', 'round');
frame.setAttribute('stroke-width', '3');
frame.setAttribute('d',
    'M 2.5,15' +
    'L 2.5,0' +
    'L -36,-15' +
    'L -36,-35' +
    'L -30,-35'
);

const curveLeft = document.createElementNS(SVG_NAMESPACE, 'path');

curveLeft.setAttribute('fill', 'none');
curveLeft.setAttribute('stroke-linecap', 'round');
curveLeft.setAttribute('stroke-width', '6');
curveLeft.setAttribute('d',
    'M -25 -30' +
    'Q -30,-35 -25,-40'
);

const curveRight = curveLeft.cloneNode(true) as SVGLineElement;

curveRight.setAttribute('transform', 'scale(-1,1) translate(-10,0)');

const roller = document.createElementNS(SVG_NAMESPACE, 'rect');

roller.setAttribute('stroke-linecap', 'round');
roller.setAttribute('stroke-width', '6');
roller.setAttribute('x', '-22.5');
roller.setAttribute('y', '-47.5');
roller.setAttribute('width', '55');
roller.setAttribute('height', '25');
roller.setAttribute('rx', '1');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(handle, frame, curveLeft, curveRight, roller);

const BUTTON = getNewButton(g, ACTION_ID, 'Toggle Style Editor');

export default BUTTON;
