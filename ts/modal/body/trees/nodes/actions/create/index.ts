import TEMPLATE from './button';

import {addActionButton} from '../button';
import {getSubPredicateResponses} from '../edit';
import * as tooltip from '../tooltip';

import Middle from '../../middle';
import Child from '../../child';
import type Root from '../../root';

function doAction(parent: Root | Middle, button) {
    const {seed} = parent;
    const child = 'children' in seed ? new Middle(seed, parent, 0) : new Child(seed, parent, 0);

    Promise.all(getSubPredicateResponses(parent))
        .catch((reason) => {
            child.disconnect();

            if (reason) {
                tooltip.show(reason, button)
            }
        });
}

export function mount(node: Root | Middle): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
