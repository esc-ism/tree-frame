import TEMPLATE from './button';

import {addActionButton} from '../button';
import {getSubPredicateResponse} from '../edit';
import * as tooltip from '../tooltip';

import Middle from '../../middle';
import Child from '../../child';
import type Root from '../../root';

function doAction(parent: Root | Middle, button) {
    const {seed} = parent;
    const child = 'children' in seed ? new Middle(seed, parent, 0) : new Child(seed, parent, 0);

    const response = getSubPredicateResponse(parent);

    if (response !== true) {
        child.disconnect();

        if (typeof response === 'string') {
            tooltip.show(response, button)
        }
    }
}

export function mount(node: Root | Middle): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
