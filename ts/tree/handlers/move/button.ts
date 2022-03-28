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

const arrowHead1 = document.createElementNS(NAMESPACE, 'line');

arrowHead1.setAttribute('stroke-linecap', 'round');
arrowHead1.setAttribute('stroke-width', '10');
arrowHead1.setAttribute('x1', '70');
arrowHead1.setAttribute('x2', '58');
arrowHead1.setAttribute('y1', '43');
arrowHead1.setAttribute('y2', '55');

const arrowHead2 = arrowHead1.cloneNode(true) as SVGLineElement;

arrowHead2.setAttribute('x2', '82');

const arrowTail1 = arrowHead1.cloneNode(true) as SVGLineElement;

arrowTail1.setAttribute('transform', 'rotate(180 70 70)');

const arrowTail2 = arrowHead2.cloneNode(true) as SVGLineElement;

arrowTail2.setAttribute('transform', 'rotate(180 70 70)');

const g = document.createElementNS(NAMESPACE, 'g');

g.append(arrowTrunk, arrowHead1, arrowHead2, arrowTail1, arrowTail2);

const button = getNewButton(g, ACTION_CLASS_NAME);

export default button;
