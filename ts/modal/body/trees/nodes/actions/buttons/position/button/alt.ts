import {ALT_CLASS} from '../../consts';
import {getNewButton} from '../../button';

import {SVG_NAMESPACE} from '@/modal/consts';

const G_ALT = (() => {
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

    const arrowTopRight = arrowBottomLeft.cloneNode(true) as SVGLineElement;

    arrowTopRight.setAttribute('transform', 'rotate(180)');

    const arrowTopLeft = arrowBottomRight.cloneNode(true) as SVGLineElement;

    arrowTopLeft.setAttribute('transform', 'rotate(180)');

    const g = document.createElementNS(SVG_NAMESPACE, 'g');

    g.classList.add(ALT_CLASS);

    g.append(arrowTrunk, arrowBottomLeft, arrowBottomRight, arrowTopRight, arrowTopLeft);

    return g;
})();

export function getPositionedButton(gDefault: SVGGElement, actionId: string, description: string, transform: object = {}) {
    const g = document.createElementNS(SVG_NAMESPACE, 'g');
    const gAlt = G_ALT.cloneNode(true) as SVGGElement;

    gAlt.setAttribute('transform', Object.entries(transform).map(([key, value]) => `${key}(${value})`).join(' '));

    g.append(gAlt, gDefault);

    return getNewButton(g, actionId, description);
}
