import {BUTTON_CLASS, SVG_CLASS} from './consts';

import {SVG_NAMESPACE} from '../../consts';

import type Root from '../../tree/nodes/root';
import type Child from '../../tree/nodes/child';

// Creates an instantiation & adds it to the DOM
export function addActionButton(template: HTMLButtonElement, position: number, doAction: Function, node: Root | Child) {
    const button = template.cloneNode(true) as HTMLButtonElement;

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    // Prevent enter/esc buttons presses from unfocusing
    button.addEventListener('keydown', (event) => {
        event.stopPropagation();
    });

    node.element.addButton(button, position);
}

// Creates a template
export const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');

    buttonTemplate.classList.add(BUTTON_CLASS);
    // Prevent tabbing to buttons until node is focused
    buttonTemplate.setAttribute('tabIndex', '-1');

    const svgTemplate = (() => {
        const circle = document.createElementNS(SVG_NAMESPACE, 'circle');

        circle.setAttribute('cx', '70');
        circle.setAttribute('cy', '70');
        circle.setAttribute('r', '50');
        circle.setAttribute('stroke-width', '10');

        const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

        svg.classList.add(SVG_CLASS);
        svg.setAttribute('viewBox', '0 0 140 140');

        svg.append(circle);

        return svg;
    })();

    return function (group: SVGGElement, actionId: string): HTMLButtonElement {
        const button = buttonTemplate.cloneNode(true) as HTMLButtonElement;
        const svg = svgTemplate.cloneNode(true) as SVGSVGElement;

        button.classList.add(actionId);

        svg.append(group);
        button.append(svg);

        return button;
    };
})();
