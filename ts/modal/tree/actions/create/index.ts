// TODO Organise all inputs like this.
//  Aka space between imports from different directories, closest imports to farthest.
import TEMPLATE from './button';
import {BUTTON_POSITION} from './consts';

import {addActionButton} from '../button';

import Middle from '../../nodes/middle';
import Child from '../../nodes/child';
import type Root from '../../nodes/root';

function doAction(parent: Root | Middle) {
    const {seed} = parent;

    if ('children' in seed) {
        new Middle(seed, parent, 0);
    } else {
        new Child(seed, parent, 0);
    }
}

export function mount(node: Root | Middle): void {
    addActionButton(TEMPLATE, BUTTON_POSITION, doAction, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return Boolean(node.seed);
}
