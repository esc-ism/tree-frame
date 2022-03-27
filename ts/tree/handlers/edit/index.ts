import type Child from '../../nodes/child';

import template from './button';

import {addButton} from '../index';
import {ACTION_ID} from './consts';

let activeNode: Child;

function isValid(): boolean {
    const {predicate} = activeNode;
    const {value} = activeNode.element.valueElement;

    switch (typeof predicate) {
        case 'boolean':
            return predicate;

        case 'function':
            return predicate(value);

        default:
            return predicate.indexOf(value as string) !== -1;
    }
}

export function update() {
    if (isValid()) {
        activeNode.value = activeNode.element.valueElement.value;

        activeNode.element.removeClass('rejected');
    } else {
        activeNode.element.addClass('rejected');
    }
}

function reset() {
    if (activeNode) {
        activeNode.element.render(activeNode.value);
        activeNode.element.removeClass('rejected');

        activeNode.element.valueElement.disabled = true;
  }

    activeNode = undefined;
}

window.addEventListener('keyup', (event) => {
    if (activeNode) {
        if (event.key === 'Enter' || event.key === 'Escape') {
            reset();
        }
    }
});

export function toggle(node) {
    reset();

    if (activeNode !== node) {
        activeNode = node;

        node.element.valueElement.disabled = false;
        node.element.valueElement.select();
    }
}

export function mount(node: Child): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        toggle(node);
    });

    addButton(node, button, ACTION_ID);

    node.element.valueElement.addEventListener('input', update);
}

export function shouldMount(node: Child): boolean {
    return node.predicate !== false;
}
