import TEMPLATE from './button';
import {BUTTON_POSITION, ACTION_ID} from './consts';

import {addActionButton} from '../button';
import {setActive} from '../active';

import type Child from '../../nodes/child';

import {TREE_CONTAINER} from '../../../consts';

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    activeNode.element.render(activeNode.value);

    TREE_CONTAINER.classList.remove(ACTION_ID);

    setActive(activeNode, ACTION_ID, false);

    activeNode.element.removeClass('rejected');

    activeNode.element.valueElement.setAttribute('tabIndex', '-1');
    activeNode.element.valueElement.disabled = true;

    activeNode = undefined;
}

function getPredicateResponse(predicate, argument) {
    const response = predicate(argument);

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

function passesAncestorPredicates(parent) {
    if (parent.ancestorPredicate && !getPredicateResponse(parent.ancestorPredicate, parent.children)) {
        return false;
    }

    if ('parent' in parent) {
        return passesAncestorPredicates(parent.parent);
    }

    return true;
}

function passesParentPredicate(node: Child) {
    const {parentPredicate, children} = node.parent;

    return !parentPredicate || getPredicateResponse(parentPredicate, children);
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
    return passesOwnPredicate(node) && passesParentPredicate(node) && passesAncestorPredicates(node.parent);
}

export function update() {
    if (isValid()) {
        activeNode.value = getValue(activeNode);

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

            if (isValid(node)) {
                node.element.render(node.value);
            } else {
                node.value = !node.value;
            }
        } else {
            activeNode = node;

            TREE_CONTAINER.classList.add(ACTION_ID);

            setActive(activeNode, ACTION_ID);

            node.element.valueElement.setAttribute('tabIndex', '1');
            node.element.valueElement.disabled = false;

            node.element.valueElement.select();
            node.element.valueElement.click();
        }
    }
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, BUTTON_POSITION, doAction, node);

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
