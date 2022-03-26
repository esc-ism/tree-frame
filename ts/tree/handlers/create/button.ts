import {NAMESPACE} from '../consts';
import {getButton} from '../index';
import {CLASS_NAME as ACTION_CLASS_NAME} from './consts';

const lineHorizontal = document.createElementNS(NAMESPACE, 'line');

lineHorizontal.setAttribute('stroke-linecap', 'round');
lineHorizontal.setAttribute('stroke-width', '12');
lineHorizontal.setAttribute('x1', '40');
lineHorizontal.setAttribute('x2', '100');
lineHorizontal.setAttribute('y1', '70');
lineHorizontal.setAttribute('y2', '70');

const lineVertical = lineHorizontal.cloneNode(true) as SVGLineElement;

lineVertical.setAttribute('transform', 'rotate(90 70 70)');

const g = document.createElementNS(NAMESPACE, 'g');

g.append(lineHorizontal, lineVertical);

const button = getButton(g, ACTION_CLASS_NAME);

export default button;
