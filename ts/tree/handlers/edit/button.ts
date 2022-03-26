import {NAMESPACE} from '../consts';
import {getButton} from '../index';
import {CLASS_NAME as ACTION_CLASS_NAME} from './consts';

const point0 = document.createElementNS(NAMESPACE, 'line');

point0.setAttribute('x1', '70');
point0.setAttribute('x2', '70');
point0.setAttribute('y1', '36   ');
point0.setAttribute('y2', '56');
point0.setAttribute('stroke-width', '6');
point0.setAttribute('transform', 'rotate(30 70 35.4)');

const point1 = point0.cloneNode(true) as SVGLineElement;

point1.setAttribute('transform', 'rotate(-30 70 35.4)');

const pointFill = document.createElementNS(NAMESPACE, 'polygon');

pointFill.setAttribute('points', '66,43 70,35.5 74,43');
pointFill.setAttribute('stroke-width', '6');
pointFill.setAttribute('fill', 'none');

const side0 = document.createElementNS(NAMESPACE, 'line');

side0.setAttribute('x1', '60');
side0.setAttribute('x2', '60');
side0.setAttribute('y1', '53');
side0.setAttribute('y2', '103');
side0.setAttribute('stroke-width', '6');
side0.setAttribute('stroke-linecap', 'round');

const side1 = side0.cloneNode(true) as SVGLineElement;

side1.setAttribute('transform', 'translate(20 0)');

const topCurve = document.createElementNS(NAMESPACE, 'path');

topCurve.setAttribute('fill', 'none');
topCurve.setAttribute('stroke-width', '5');
topCurve.setAttribute('d',
    'm 58.7,53' +
    'c7.5,5 15,5 22.5,0'
);

const bottomCurve = topCurve.cloneNode(true) as SVGPathElement;

bottomCurve.setAttribute('transform', 'translate(0 49.7)');

const g = document.createElementNS(NAMESPACE, 'g');

g.setAttribute('transform', 'rotate(212 70 70)');

g.append(point0, point1, pointFill, side0, side1, topCurve, bottomCurve);

const button = getButton(g, ACTION_CLASS_NAME);

export default button;
