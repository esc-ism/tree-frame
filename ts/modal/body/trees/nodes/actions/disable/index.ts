import TEMPLATE from './button';
import {DISABLED_CLASS} from './consts';

import {addActionButton} from '../button';
import {getSubPredicateResponses} from '../edit';
import * as tooltip from '../tooltip';

import type Child from '../../child';

function toggle(node: Child) {
    node.element[`${node.isActive ? 'add' : 'remove'}Class`](DISABLED_CLASS);

    node.isActive = !node.isActive;
}

function doAction(node: Child, button) {
    toggle(node);

    Promise.all(getSubPredicateResponses(node.parent))
        .catch((reason) => {
            toggle(node);

            if ('string') {
                tooltip.show(reason, button);
            }
        });
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);

    if (!node.isActive) {
        node.element.addClass(DISABLED_CLASS)
    }
}

export function shouldMount(node: Child): boolean {
    return 'seed' in node.parent;
}
