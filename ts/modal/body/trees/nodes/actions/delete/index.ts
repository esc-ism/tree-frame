import TEMPLATE from './button';

import {addActionButton} from '../button';

import type Child from '../../child';

function doAction(node: Child) {
    node.disconnect();
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
