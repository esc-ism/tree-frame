import type * as types from '../../../types';

import type {Upper} from '../../nodes/unions';
import Inner from '../../nodes/inner';
import Outer from '../../nodes/outer';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

function isInner(node: types.Middle): node is types.Inner {
    const [model] = node.children;

    return 'children' in model;
}

export function act(parent: Upper) {
    const {seed} = parent;

    if (isInner(seed)) {
        new Inner(seed, parent, 0);
    } else {
        new Outer(seed, parent, 0);
    }
}

export function mount(node: Upper): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        act(node);
    });

    addButton(node, button, ACTION_ID);
}

export function shouldMount(node: Upper): boolean {
    return Boolean(node.seed);
}
