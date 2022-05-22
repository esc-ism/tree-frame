import TEMPLATE from './button';

import {addActionButton} from '../button';
import {getSubPredicateResponses} from '../edit';
import * as tooltip from '../tooltip';

import type Child from '../../child';

function doAction(node: Child, button) {
    const oldParent = node.parent;

    node.isActive = false;

    Promise.all(getSubPredicateResponses(oldParent))
        .then(() => {
            node.disconnect();
        })
        .catch((reason) => {
            node.isActive = true;

            if ('string') {
                tooltip.show(reason, button)
            }
        });
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return 'seed' in node.parent;
}
