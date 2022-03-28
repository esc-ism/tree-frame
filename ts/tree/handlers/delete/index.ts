import type Child from '../../nodes/child';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

function doAction(node: Child) {
    node.disconnect();
}

export function mount(node: Child): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    addButton(node, button, ACTION_ID);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
