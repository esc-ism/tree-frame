import TEMPLATE from './button';
import {BUTTON_POSITION} from './consts';

import {addActionButton} from '../button';

import type Child from '../../nodes/child';

function doAction(node: Child) {
    node.disconnect();
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, BUTTON_POSITION, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
