import {BUTTON_CLASS, CIRCLE_CLASS, G_BACK_CLASS, G_FRONT_CLASS} from './consts';

import type Root from '../root';
import type Child from '../child';

import {SVG_NAMESPACE} from '../../../../consts';

// Creates an instantiation & adds it to the DOM
export function addActionButton(template: HTMLButtonElement, doAction: Function, node: Root | Child) {
    const button = template.cloneNode(true) as HTMLButtonElement;

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    button.addEventListener('keydown', (event) => {
        // Prevent button presses via the Enter key from unfocusing the node
        if (event.key === 'Enter') {
            event.stopPropagation();
        }
    });

    node.element.addButton(button);
}

// Creates a template
export const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');

    buttonTemplate.classList.add(BUTTON_CLASS);
    // Prevent tabbing to buttons until node is focused
    buttonTemplate.setAttribute('tabIndex', '-1');

    const gTemplate = (() => {
        const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

        circle.classList.add(CIRCLE_CLASS);

        circle.setAttribute('cx', '70');
        circle.setAttribute('cy', '70');
        circle.setAttribute('r', '50');
        circle.setAttribute('stroke-width', '10');

        const g = document.createElementNS(SVG_NAMESPACE, 'g');

        g.append(circle);

        return g;
    })();

    return function (group: SVGGElement, actionId: string): HTMLButtonElement {
        const button = buttonTemplate.cloneNode(true) as HTMLButtonElement;
        const gBack = gTemplate.cloneNode(true) as SVGSVGElement;

        gBack.append(group);

        const gFront = gBack.cloneNode(true) as SVGGElement;

        button.classList.add(actionId);
        gBack.classList.add(G_BACK_CLASS);
        gFront.classList.add(G_FRONT_CLASS);

        const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

        svg.setAttribute('viewBox', '0 0 140 140');

        svg.append(gBack, gFront)
        button.append(svg);

        return button;
    };
})();
