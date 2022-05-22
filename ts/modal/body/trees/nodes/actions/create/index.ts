import TEMPLATE from './button';
import {PENDING_CLASS} from '../consts';

import {addActionButton} from '../button';
import {getSubPredicateResponses} from '../edit';
import * as tooltip from '../tooltip';

import Middle from '../../middle';
import Child from '../../child';
import type Root from '../../root';

//TODO Have a button for create & another for copy.
// On either, show location selection buttons like with move.

function doAction(parent: Root | Middle, button) {
    const {seed} = parent;
    const child = 'children' in seed ? new Middle(seed, parent, 0) : new Child(seed, parent, 0);

    child.element.addClass(PENDING_CLASS);

    Promise.all(getSubPredicateResponses(parent))
        .then(() => {
            child.element.removeClass(PENDING_CLASS);
        })
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
    return 'seed' in node;
}
