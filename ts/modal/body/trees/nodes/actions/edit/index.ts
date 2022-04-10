import TEMPLATE from './button';
import {ACTION_ID, INVALID_CLASS} from './consts';

import {addActionButton} from '../button';
import {setActive} from '../active';

import type Child from '../../child';
import type Middle from '../../middle';
import type Root from '../../root';

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    activeNode.element.render(activeNode.value);

    setActive(activeNode, ACTION_ID, false);

    activeNode.element.removeClass(INVALID_CLASS);

    activeNode.element.valueElement.setAttribute('tabIndex', '-1');
    activeNode.element.valueElement.disabled = true;

    activeNode = undefined;
}

function getPredicateResponse(predicate: (...args: any) => unknown, ...args: Array<any>) {
    const response = predicate(...args);

    if (typeof response === 'string') {
        // TODO Definitely set up tooltips for String predicate returns
        return false;
    }

    return Boolean(response);
}

function getValue(node) {
    const {value} = node.element.valueElement;

    switch (typeof node.value) {
        case 'number':
            return Number(value);

        case 'boolean':
            return Boolean(value);

        default:
            return value;
    }
}

function passesAncestorPredicates(parent: Root | Middle) {
    if (parent.ancestorPredicate && !getPredicateResponse(parent.ancestorPredicate, parent.children)) {
        return false;
    }

    if ('parent' in parent) {
        return passesAncestorPredicates(parent.parent);
    }

    return true;
}

function passesParentPredicate({parentPredicate, children}: Root | Middle) {
    return !parentPredicate || getPredicateResponse(parentPredicate, children);
}

export function passesSubPredicates(parent) {
    return passesParentPredicate(parent) && passesAncestorPredicates(parent);
}

function passesOwnPredicate(node: Child) {
    const {predicate} = node;
    const value = getValue(node);

    switch (typeof predicate) {
        case 'boolean':
            return predicate;

        case 'function':
            return getPredicateResponse(predicate, value);

        default:
            return predicate.indexOf(value as string) !== -1;
    }
}

function isValid(node: Child = activeNode): boolean {
    return passesOwnPredicate(node) && passesSubPredicates(node);
}

export function update() {
    const previousValue = activeNode.value;

    activeNode.value = getValue(activeNode);

    if (isValid()) {
        activeNode.element.removeClass(INVALID_CLASS);
    } else {
        activeNode.value = previousValue;

        activeNode.element.addClass(INVALID_CLASS);
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

            if (isValid(node)) {
                node.element.render(node.value);
            } else {
                node.value = !node.value;
            }
        } else {
            activeNode = node;

            setActive(activeNode, ACTION_ID);

            node.element.valueElement.setAttribute('tabIndex', '1');
            node.element.valueElement.disabled = false;

            node.element.valueElement.select();
            node.element.valueElement.click();
        }
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        reset();
    }
});

export function mount(node: Child): void {
    addActionButton(TEMPLATE, doAction, node);

    node.element.valueElement.addEventListener('input', update);

    node.element.valueElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation();

            reset();
        }
    });
}

export function shouldMount(node: Child): boolean {
    if (!node.predicate) {
        return false;
    }

    switch (typeof node.predicate) {
        case 'boolean':
            return node.predicate;

        case 'object':
            // Prevent editing if there are no other valid values
            return node.predicate.length > 1;

        default:
            return true;
    }
}
