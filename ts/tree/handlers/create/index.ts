import Middle from '../../nodes/middle';
import Child from '../../nodes/child';
import type Root from '../../nodes/root';

import template from './button';

import {addActionButton} from '../index';
import {ACTION_ID} from './consts';

function doAction(parent: Root | Middle) {
    const {seed} = parent;

    if ('children' in seed) {
        new Middle(seed, parent, 0);
    } else {
        new Child(seed, parent, 0);
    }
}

export function mount(node: Root | Middle): void {
    addActionButton(template, ACTION_ID, doAction, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
