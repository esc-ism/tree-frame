import {NAMESPACE} from '../consts';
import {getButton} from '../index';
import {ACTION_ID, CLASS_NAME as ACTION_CLASS_NAME} from './consts';

const arrowTrunk = document.createElementNS(NAMESPACE, 'line');

arrowTrunk.setAttribute('stroke-linecap', 'round');
arrowTrunk.setAttribute('stroke-width', '12');
arrowTrunk.setAttribute('x1', '70');
arrowTrunk.setAttribute('x2', '70');
arrowTrunk.setAttribute('y1', '40');
arrowTrunk.setAttribute('y2', '100');

const arrowHead = document.createElementNS(NAMESPACE, 'line');

arrowHead.setAttribute('stroke-linecap', 'round');
arrowHead.setAttribute('stroke-width', '12');
arrowHead.setAttribute('x1', '70');
arrowHead.setAttribute('x2', '55');
arrowHead.setAttribute('y1', '40');
arrowHead.setAttribute('y2', '55');

const arrowTail = arrowHead.cloneNode(true) as SVGLineElement;

arrowTail.setAttribute('transform', 'rotate(180 70 70)');

const g = document.createElementNS(NAMESPACE, 'g');

g.append(arrowTrunk, arrowHead, arrowTail);

const button = getButton(g, ACTION_CLASS_NAME);

export default button;
