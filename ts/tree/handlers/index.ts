import {NAMESPACE, BUTTON_ORDER, SVG_CLASS_NAME, BUTTON_CLASS_NAME} from './consts';

import Root from '../nodes/root';
import Middle from '../nodes/middle';

export function addButton(node: Root | Middle, button: Node, id: string) {
    node.element.addButton(button, BUTTON_ORDER[id]);
}

export const getButton = (function () {
    const template = (() => {
        const circle = document.createElementNS(NAMESPACE, 'circle');

        circle.setAttribute('cx', '70');
        circle.setAttribute('cy', '70');
        circle.setAttribute('r', '50');
        circle.setAttribute('stroke-width', '10');
        circle.setAttribute('fill', 'none');

        const svg = document.createElementNS(NAMESPACE, 'svg');

        svg.setAttribute('viewBox', '0 0 140 140');
        svg.classList.add(SVG_CLASS_NAME);

        svg.append(circle);

        return svg;
    })();

    return function (group: SVGGElement, actionClass: string): HTMLElement {
        const copy = template.cloneNode(true) as SVGSVGElement;

        copy.classList.add(actionClass);

        copy.append(group);

        const button = document.createElement('span');

        button.classList.add(BUTTON_CLASS_NAME);

        button.append(copy);

        return button;
    };
})();
