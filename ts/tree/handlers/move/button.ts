import {NAMESPACE} from '../consts';
import {getNewButton} from '../index';
import {CLASS_NAME as ACTION_CLASS_NAME} from './consts';

const arrowTrunk = document.createElementNS(NAMESPACE, 'line');

arrowTrunk.setAttribute('stroke-linecap', 'round');
arrowTrunk.setAttribute('stroke-width', '10');
arrowTrunk.setAttribute('x1', '70');
arrowTrunk.setAttribute('x2', '70');
arrowTrunk.setAttribute('y1', '40');
arrowTrunk.setAttribute('y2', '100');

const arrowBottomLeft = document.createElementNS(NAMESPACE, 'line');

arrowBottomLeft.setAttribute('stroke-linecap', 'round');
arrowBottomLeft.setAttribute('stroke-width', '10');
arrowBottomLeft.setAttribute('x1', '70');
arrowBottomLeft.setAttribute('x2', '58');
arrowBottomLeft.setAttribute('y1', '97');
arrowBottomLeft.setAttribute('y2', '85');

const arrowBottomRight = arrowBottomLeft.cloneNode(true) as SVGLineElement;

arrowBottomRight.setAttribute('x2', '82');

const gMain = document.createElementNS(NAMESPACE, 'g');

gMain.append(arrowTrunk, arrowBottomLeft, arrowBottomRight);

const gSibling = gMain.cloneNode(true) as SVGGElement;

export const siblingButton = getNewButton(gSibling, ACTION_CLASS_NAME);

const gParent = gMain.cloneNode(true) as SVGGElement;

gParent.setAttribute('transform', 'rotate(-45 70 70)');

export const parentButton = getNewButton(gParent, ACTION_CLASS_NAME);

const arrowTopRight = arrowBottomLeft.cloneNode(true) as SVGLineElement;

arrowTopRight.setAttribute('transform', 'rotate(180 70 70)');

const arrowTopLeft = arrowBottomRight.cloneNode(true) as SVGLineElement;

arrowTopLeft.setAttribute('transform', 'rotate(180 70 70)');

gMain.append(arrowTopRight, arrowTopLeft);

const mainButton = getNewButton(gMain, ACTION_CLASS_NAME);

export default mainButton;
