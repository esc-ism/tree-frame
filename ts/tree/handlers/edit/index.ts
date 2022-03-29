import Root from '../../nodes/root';
import type Child from '../../nodes/child';

import template from './button';

import {focus} from '../focus';

import {addActionButton, setActive} from '../index';
import {ACTION_ID, CLASS_NAME as BUTTON_CLASS_NAME} from './consts';

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    activeNode.element.render(activeNode.value);

    Root.instance.element.removeClass(BUTTON_CLASS_NAME);

    focus(false, activeNode);
    setActive(activeNode, BUTTON_CLASS_NAME, false);

    activeNode.element.removeClass('rejected');

    activeNode.element.valueElement.disabled = true;

    activeNode = undefined;
}

function toCorrectType(value) {
    switch (typeof activeNode.value) {
        case 'number':
            return Number(value);

        case 'boolean':
            return Boolean(value);

        default:
            return value;
    }
}

function isValid(): boolean {
    const {predicate} = activeNode;
    const value = toCorrectType(activeNode.element.valueElement.value);

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
        activeNode.value = toCorrectType(activeNode.element.valueElement.value);

        activeNode.element.removeClass('rejected');
    } else {
        activeNode.element.addClass('rejected');
    }
}

window.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
        reset();
    }
});

export function unmount(node) {
    if (node === activeNode) {
        reset();
    }
}

export function doAction(node) {
    const previousNode = activeNode;

    reset();

    if (previousNode !== node) {
        if (typeof node.value === 'boolean') {
            node.value = !node.value;

            node.element.render(node.value);
        } else {
            activeNode = node;

            Root.instance.element.addClass(BUTTON_CLASS_NAME);

            focus(true, activeNode, false);
            setActive(activeNode, BUTTON_CLASS_NAME);

            node.element.valueElement.disabled = false;
            node.element.valueElement.select();
        }
    }
}

export function mount(node: Child): void {
    addActionButton(template, ACTION_ID, doAction, node);

    node.element.valueElement.addEventListener('input', update);
}

export function shouldMount(node: Child): boolean {
    switch (typeof node.predicate) {
        case 'boolean':
            return node.predicate !== false;

        case 'object':
            // Prevent editing if there are no other valid values
            return node.predicate.length > 1;

        default:
            return true;
    }
}
