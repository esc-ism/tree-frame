import type Child from '../../nodes/child';

import template from './button';

import {addActionButton} from '../index';
import {ACTION_ID} from './consts';

function doAction(node: Child) {
    node.disconnect();
}

export function mount(node: Child): void {
    addActionButton(template, ACTION_ID, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed);
}
