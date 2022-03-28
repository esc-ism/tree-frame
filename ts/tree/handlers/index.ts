import {NAMESPACE, BUTTON_ORDER, SVG_CLASS_NAME, BUTTON_CLASS_NAME, ACTIVE_CLASS_NAME} from './consts';

import Root from '../nodes/root';
import Leaf from '../nodes/child';

export function addButton(node: Root | Leaf, button: Node, id: string) {
    node.element.addButton(button, BUTTON_ORDER.indexOf(id));
}

export const getNewButton = (function () {
    const template = (() => {
        const circle = document.createElementNS(NAMESPACE, 'circle');

        circle.setAttribute('cx', '70');
        circle.setAttribute('cy', '70');
        circle.setAttribute('r', '50');
        circle.setAttribute('stroke-width', '10');

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

let isActive: boolean = false;

export function setActive(node, actionClass: string, doActivate = true) {
    const button = node.element.buttonContainer.querySelector(`.${actionClass}`);

    button.classList[doActivate ? 'add' : 'remove'](ACTIVE_CLASS_NAME);

    isActive = doActivate;
}

// Basically a getter
export function actionIsActive(): boolean {
    return isActive;
}
