import {Predicate, Value} from '../../../types';

import type Child from '../../nodes/child';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

let activeNode: Child = null;

function isValid(predicate: Predicate, value: Value): boolean {
    switch (typeof predicate) {
        case 'boolean':
            return predicate;

        case 'function':
            return predicate(value);

        default:
            return predicate.indexOf(value as string) !== -1;
    }
}

function close() {
    if (!activeNode) {
        return;
    }

    //TODO

    activeNode.element.setSelected(false);

    activeNode = null;
}

function open(node: Child) {
    activeNode = node;

    const {predicate} = node;
    const values = node.parent.children.map((node) => node.getValue());
    const index = node.parent.children.indexOf(node);
}

export function toggle(node) {
    const doOpen = node !== activeNode;

    close();

    if (doOpen) {
        open(node);
    }
}

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        close();
    }
});

export function mount(node: Child): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        toggle(node);
    });

    addButton(node, button, ACTION_ID);
}

export function shouldMount(node: Child): boolean {
    return node.predicate !== false;
}
