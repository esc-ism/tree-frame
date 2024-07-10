import {ACTION_ID} from './consts';

import {getPositionedButton} from '../position/button/alt';

import {SVG_NAMESPACE} from '@/modal/consts';

const arrowTrunk = document.createElementNS(SVG_NAMESPACE, 'line');

arrowTrunk.setAttribute('stroke-linecap', 'round');
arrowTrunk.setAttribute('stroke-width', '10');
arrowTrunk.setAttribute('y1', '-30');
arrowTrunk.setAttribute('y2', '30');

const arrowBottomLeft = document.createElementNS(SVG_NAMESPACE, 'line');

arrowBottomLeft.setAttribute('stroke-linecap', 'round');
arrowBottomLeft.setAttribute('stroke-width', '10');
arrowBottomLeft.setAttribute('x2', '-12');
arrowBottomLeft.setAttribute('y1', '27');
arrowBottomLeft.setAttribute('y2', '15');

const arrowBottomRight = arrowBottomLeft.cloneNode(true) as SVGLineElement;

arrowBottomRight.setAttribute('x2', '12');

const g = document.createElementNS(SVG_NAMESPACE, 'g');

g.append(arrowTrunk, arrowBottomLeft, arrowBottomRight);

const BUTTON = getPositionedButton(g, ACTION_ID, 'Move');

export default BUTTON;
