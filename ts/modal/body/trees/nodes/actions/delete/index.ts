import TEMPLATE from './button';

import {addActionButton} from '../button';

import type Child from '../../child';
import {passesSubPredicates} from '../edit';

function doAction(node: Child) {
    const revert = node.attach.bind(node, node.parent, node.getIndex());

    node.disconnect();

    if (!passesSubPredicates(node.parent)) {
        revert();
    }
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
