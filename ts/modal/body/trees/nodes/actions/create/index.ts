import TEMPLATE from './button';

import {addActionButton} from '../button';
import {passesSubPredicates} from '../edit';

import Middle from '../../middle';
import Child from '../../child';
import type Root from '../../root';

function doAction(parent: Root | Middle) {
    const {seed} = parent;
    const child = 'children' in seed ? new Middle(seed, parent, 0) : new Child(seed, parent, 0);

    if (!passesSubPredicates(parent)) {
        child.disconnect();
    }
}

export function mount(node: Root | Middle): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
