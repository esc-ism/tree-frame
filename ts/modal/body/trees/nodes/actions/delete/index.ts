import TEMPLATE from './button';

import {addActionButton} from '../button';

import type Child from '../../child';
import {getSubPredicateResponse} from '../edit';
import * as tooltip from '../tooltip';

function doAction(node: Child, button) {
    const oldParent = node.parent;
    const index = node.getIndex();

    node.disconnect();

    const response = getSubPredicateResponse(oldParent);

    if (response !== true) {
        node.attach(oldParent, index);

        if (typeof response === 'string') {
            tooltip.show(response, button)
        }
    }
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
