import {NAMESPACE, BUTTON_ORDER, BUTTON_CLASS_NAME, SVG_CLASS_NAME, ACTIVE_CLASS_NAME} from './consts';

import Root from '../nodes/root';
import Leaf from '../nodes/child';
import Child from '../nodes/child';

import {doAction as doFocus} from './focus';

export function addButton(node: Root | Leaf, button: HTMLButtonElement, id: string) {
    node.element.addButton(button, BUTTON_ORDER.indexOf(id));
}

export const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');

    buttonTemplate.setAttribute('tabIndex', '-1');
    buttonTemplate.classList.add(BUTTON_CLASS_NAME);

    const svgTemplate = (() => {
        const circle = document.createElementNS(NAMESPACE, 'circle');

        circle.setAttribute('cx', '70');
        circle.setAttribute('cy', '70');
        circle.setAttribute('r', '50');
        circle.setAttribute('stroke-width', '10');

        const svg = document.createElementNS(NAMESPACE, 'svg');

        svg.classList.add(SVG_CLASS_NAME);
        svg.setAttribute('viewBox', '0 0 140 140');

        svg.append(circle);

        return svg;
    })();

    return function (group: SVGGElement, actionClass: string): HTMLButtonElement {
        const button = buttonTemplate.cloneNode(true) as HTMLButtonElement;
        const svg = svgTemplate.cloneNode(true) as SVGSVGElement;

        svg.classList.add(actionClass);

        svg.append(group);
        button.append(svg);

        return button;
    };
})();

let isActive: boolean = false;

export function setActive(node: Child, actionClass: string, doActivate = true) {
    const button = node.element.buttonContainer.querySelector(`.${actionClass}`);

    button.classList[doActivate ? 'add' : 'remove'](ACTIVE_CLASS_NAME);

    doFocus(node, true);

    isActive = doActivate;
}

// Basically a getter
export function actionIsActive(): boolean {
    return isActive;
}

export function addActionButton(template: HTMLButtonElement, actionId, doAction, node) {
    const button = template.cloneNode(true) as HTMLButtonElement;

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    addButton(node, button, actionId);
}
