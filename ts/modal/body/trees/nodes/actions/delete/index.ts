import TEMPLATE from './button';

import {addActionButton} from '../button';

import type Child from '../../child';
import {getSubPredicateResponses} from '../edit';
import * as tooltip from '../tooltip';

function doAction(node: Child, button) {
    const oldParent = node.parent;
    const index = node.getIndex();

    node.disconnect();

    Promise.all(getSubPredicateResponses(oldParent))
        .catch((reason) => {
            node.attach(oldParent, index);

            if ('string') {
                tooltip.show(reason, button)
            }

        });
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
