import {ACTION_ID} from './consts';

import {getNewButton} from '../button';

import {SVG_NAMESPACE} from '../../../../../consts';

const arrowTrunk = document.createElementNS(SVG_NAMESPACE, 'line');

arrowTrunk.setAttribute('stroke-linecap', 'round');
arrowTrunk.setAttribute('stroke-width', '10');
arrowTrunk.setAttribute('x1', '70');
arrowTrunk.setAttribute('x2', '70');
arrowTrunk.setAttribute('y1', '40');
arrowTrunk.setAttribute('y2', '100');

const arrowBottomLeft = document.createElementNS(SVG_NAMESPACE, 'line');

arrowBottomLeft.setAttribute('stroke-linecap', 'round');
arrowBottomLeft.setAttribute('stroke-width', '10');
arrowBottomLeft.setAttribute('x1', '70');
arrowBottomLeft.setAttribute('x2', '58');
arrowBottomLeft.setAttribute('y1', '97');
arrowBottomLeft.setAttribute('y2', '85');

const arrowBottomRight = arrowBottomLeft.cloneNode(true) as SVGLineElement;

arrowBottomRight.setAttribute('x2', '82');

const gMain = document.createElementNS(SVG_NAMESPACE, 'g');

gMain.append(arrowTrunk, arrowBottomLeft, arrowBottomRight);

const gSibling = gMain.cloneNode(true) as SVGGElement;

export const BUTTON_SIBLING = getNewButton(gSibling, ACTION_ID, 'Put After');

const gParent = gMain.cloneNode(true) as SVGGElement;

gParent.setAttribute('transform', 'rotate(-45 70 70)');

export const BUTTON_PARENT = getNewButton(gParent, ACTION_ID, 'Put Into');

const arrowTopRight = arrowBottomLeft.cloneNode(true) as SVGLineElement;

arrowTopRight.setAttribute('transform', 'rotate(180 70 70)');

const arrowTopLeft = arrowBottomRight.cloneNode(true) as SVGLineElement;

arrowTopLeft.setAttribute('transform', 'rotate(180 70 70)');

gMain.append(arrowTopRight, arrowTopLeft);

const BUTTON = getNewButton(gMain, ACTION_ID, 'Move');

export default BUTTON;
