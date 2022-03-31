import Root from '../../nodes/root';
import type Child from '../../nodes/child';

import template from './button';

import {addActionButton, setActive} from '../index';
import {ACTION_ID, CLASS_NAME as BUTTON_CLASS_NAME} from './consts';

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    activeNode.element.render(activeNode.value);

    Root.instance.element.removeClass(BUTTON_CLASS_NAME);

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

// TODO Definitely set up tooltips for String predicate returns

function passesAncestorPredicates(parent = activeNode.parent) {
    if (parent.ancestorPredicate && parent.ancestorPredicate(parent.children)) {
        return false;
    }

    if ('parent' in parent) {
        return passesAncestorPredicates(parent.parent);
    }

    return true;
}

function passesParentPredicate() {
    const {parentPredicate, children} = activeNode.parent;

    return !(parentPredicate && parentPredicate(children));
}

function passesOwnPredicate() {
    const {predicate} = activeNode;
    const value = toCorrectType(activeNode.element.valueElement.value);

    switch (typeof predicate) {
        case 'boolean':
            return predicate;

        case 'function':
            return Boolean(predicate(value));

        default:
            return predicate.indexOf(value as string) !== -1;
    }
}

function isValid(): boolean {
    return passesOwnPredicate() && passesParentPredicate() && passesAncestorPredicates();
}

export function update() {
    if (isValid()) {
        activeNode.value = toCorrectType(activeNode.element.valueElement.value);

        activeNode.element.removeClass('rejected');
    } else {
        activeNode.element.addClass('rejected');
    }
}

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

            setActive(activeNode, BUTTON_CLASS_NAME);

            node.element.valueElement.disabled = false;
            node.element.valueElement.select();
            node.element.valueElement.click();
        }
    }
}

export function mount(node: Child): void {
    addActionButton(template, ACTION_ID, doAction, node);

    node.element.valueElement.addEventListener('input', update);

    node.element.valueElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation();

            reset();
        }
    });
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
