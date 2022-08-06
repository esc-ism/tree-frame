import {ACTION_ID} from '../consts';

import {getNewButton} from '../../button';

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

const gMain = document.createElementNS(SVG_NAMESPACE, 'g');

gMain.append(arrowTrunk, arrowBottomLeft, arrowBottomRight);

const gSibling = gMain.cloneNode(true) as SVGGElement;

export const BUTTON_SIBLING = getNewButton(gSibling, ACTION_ID, 'Select After');

const gParent = gMain.cloneNode(true) as SVGGElement;

gParent.setAttribute('transform', 'rotate(-45)');

export const BUTTON_PARENT = getNewButton(gParent, ACTION_ID, 'Select Into');
