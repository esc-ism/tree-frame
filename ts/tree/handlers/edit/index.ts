import Root from '../../nodes/root';
import type Child from '../../nodes/child';

import template from './button';

import {focus} from '../focus';

import {addButton, setActive} from '../index';
import {ACTION_ID, CLASS_NAME as BUTTON_CLASS_NAME} from './consts';

let activeNode: Child;

export function isActive() {
    return Boolean(activeNode);
}

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

export function reset() {
    if (activeNode) {
        activeNode.element.render(activeNode.value);

        Root.instance.element.removeClass(BUTTON_CLASS_NAME);

        focus(false, activeNode);
        setActive(activeNode, BUTTON_CLASS_NAME, false);

        activeNode.element.removeClass('rejected');

        activeNode.element.valueElement.disabled = true;
  }

    activeNode = undefined;
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
        activeNode = node;

        Root.instance.element.addClass(BUTTON_CLASS_NAME);

        focus(true, activeNode, false);
        setActive(activeNode, BUTTON_CLASS_NAME);

        node.element.valueElement.disabled = false;
        node.element.valueElement.select();
    }
}

export function mount(node: Child): void {
    const button = template.cloneNode(true);

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    addButton(node, button, ACTION_ID);

    node.element.valueElement.addEventListener('input', update);
}

export function shouldMount(node: Child): boolean {
    return node.predicate !== false;
}
