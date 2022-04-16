import {BUTTON_CLASS} from './consts';

import {SVG_NAMESPACE} from '../../consts';

// Adds the template to the DOM
export function bindAction(doAction: Function,button: HTMLButtonElement, hotkey: string, description: string): Function {
    const bound = (event) => {
        event.stopPropagation();

        button.blur();

        doAction();
    };

    button.addEventListener('click', bound);

    window.addEventListener('keydown', (event) => {
        if (event.altKey && event.key.toLowerCase() === hotkey) {
            bound(event);
        }
    });

    button.title = `${description} (Alt+${hotkey.toUpperCase()})`;

    return bound;
}

// Creates a template
export const getNewButton = (function () {
    const buttonTemplate = document.createElement('button');
    const svgTemplate = document.createElementNS(SVG_NAMESPACE, 'svg');

    buttonTemplate.classList.add(BUTTON_CLASS);
    // Prevent tabbing to buttons until node is focused
    buttonTemplate.setAttribute('tabIndex', '2');

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
