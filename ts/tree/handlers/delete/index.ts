import type Middle from '../../nodes/middle';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

export function act(node: Middle) {
    node.disconnect();
}

export function unmount(node: Middle) {
    // ?
}

export function mount(node: Middle): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        act(node);
    });

    addButton(node, button, ACTION_ID);
}

export function shouldMount(node: Middle): boolean {
    return Boolean(node.parent.seed);
}
