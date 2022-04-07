import TEMPLATE from './button';

import {addActionButton} from '../button';

import Middle from '../../middle';
import Child from '../../child';
import type Root from '../../root';

function doAction(parent: Root | Middle) {
    const {seed} = parent;

    if ('children' in seed) {
        new Middle(seed, parent, 0);
    } else {
        new Child(seed, parent, 0);
    }
}

export function mount(node: Root | Middle): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
