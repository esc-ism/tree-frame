import {TOOLTIP_CLASS, TOOLTIP_CONTAINER_CLASS} from './consts';

import Child from '../../../child';

export function show(node: Child, message: string) {
    const element = node.element.interactionContainer.querySelector(`.${TOOLTIP_CLASS}`) as HTMLElement;

    element.innerText = message;
}

export function hide(node) {
    show(node, '');
}

export default function generate(node: Child) {
    const parent = node.element.interactionContainer;
    const container = document.createElement('div');
    const element = document.createElement('div');

    container.classList.add(TOOLTIP_CONTAINER_CLASS);
    element.classList.add(TOOLTIP_CLASS);

    container.appendChild(element);
    parent.insertBefore(container, parent.firstChild);
}
