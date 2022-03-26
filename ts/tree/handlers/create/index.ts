import Middle from '../../nodes/middle';
import Child from '../../nodes/child';
import type Root from '../../nodes/root';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

function act(parent: Root | Middle) {
    const {seed} = parent;

    if ('children' in seed) {
        new Middle(seed, parent)
    } else {
        new Child(seed, parent)
    }
}

export function mount(node: Root | Middle): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        act(node);
    });

    addButton(node, button, ACTION_ID);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
