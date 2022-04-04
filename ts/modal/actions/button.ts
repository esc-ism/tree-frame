import {BUTTON_CLASS, SVG_CLASS, BUTTON_CONTAINER} from './consts';

import {SVG_NAMESPACE} from '../consts';

import {addTrackedChild} from '../../utils';

const buttons = [];

// Adds the template to the DOM
export function addActionButton(button: HTMLButtonElement, position: number, doAction: Function): Function {
    const listener = (event) => {
        event.stopPropagation();

        button.blur();

        doAction();
    };

    button.addEventListener('click', listener);

    addTrackedChild(BUTTON_CONTAINER, button, position, buttons);

    return listener;
}

// Creates a template
export const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');
    const svgTemplate = document.createElementNS(SVG_NAMESPACE, 'svg');

    buttonTemplate.classList.add(BUTTON_CLASS);
    // Prevent tabbing to buttons until node is focused
    buttonTemplate.setAttribute('tabIndex', '2');

    svgTemplate.classList.add(SVG_CLASS);
    svgTemplate.setAttribute('viewBox', `-70 -70 140 140`);

    return function (group: SVGGElement, actionId: string): HTMLButtonElement {
        const button = buttonTemplate.cloneNode(true) as HTMLButtonElement;
        const svg = svgTemplate.cloneNode(true) as SVGSVGElement;

        button.id = actionId;

        svg.append(group);
        button.append(svg);

        return button;
    };
})();
