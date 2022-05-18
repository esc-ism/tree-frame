import {INVALID_CLASS, VALID_CLASS} from './consts';

import * as tooltip from '../tooltip';
import {focusHovered} from '../highlight';

import type Child from '../../child';
import type Middle from '../../middle';
import type Root from '../../root';

import {getPredicateResponse, resolvePredicatePromise} from '../../../../../../messaging';
import type {SubPredicate, Value} from '../../../../../../validation/types';

let activeNode: Child;

export function isActive(): boolean {
    return Boolean(activeNode);
}

export function reset() {
    if (!activeNode) {
        return;
    }

    activeNode.element.render(activeNode.value);

    activeNode.element.removeClass(VALID_CLASS);
    activeNode.element.removeClass(INVALID_CLASS);

    activeNode.element.valueElement.blur();

    tooltip.reset();

    activeNode = undefined;
}

function getValue(node): Value {
    switch (typeof node.value) {
        case 'boolean':
            return Boolean(node.element.valueElement.checked);

        case 'number':
            return Number(node.element.valueElement.value);

        default:
            return node.element.valueElement.value;
    }
}

function getSubPredicateResponse(predicate: SubPredicate, children: Array<Child>): Promise<void> {
    return typeof predicate === 'number' ?
        getPredicateResponse(predicate, children.map(child => child.getJSON())) :
        new Promise((resolve, reject) => resolvePredicatePromise(predicate(children), resolve, reject));
}

function getDescendantPredicateResponses(node: Root | Middle): Array<Promise<void>> {
    const responses = [];
    if ('descendantPredicate' in node) {
        responses.push(getSubPredicateResponse(node.descendantPredicate, node.children));
    }

    if ('parent' in node) {
        responses.push(...getDescendantPredicateResponses(node.parent));
    }

    return responses;
}

function getChildPredicateResponse(node: Root | Middle): Promise<void> {
    if ('childPredicate' in node) {
        return getSubPredicateResponse(node.childPredicate, node.children);
    }

    return Promise.resolve(null);
}

export function getSubPredicateResponses(parent): Array<Promise<void>> {
    return [getChildPredicateResponse(parent), ...getDescendantPredicateResponses(parent)];
}

function getOwnPredicateResponse(node: Child): Promise<void> {
    const {predicate} = node;
    const value = getValue(node);

    switch (typeof predicate) {
        case 'undefined':
            return Promise.resolve();

        case 'number':
            return getPredicateResponse(predicate, value);

        case 'function':
            return new Promise((resolve, reject) => resolvePredicatePromise(predicate(value), resolve, reject));

        default:
            return Promise[predicate.indexOf(value as string) === -1 ? 'reject' : 'resolve']();
    }
}

function getAllPredicateResponses(node: Child = activeNode): Array<Promise<void>> {
    return [getOwnPredicateResponse(node), ...getSubPredicateResponses(node.parent)];
}

export function update(node) {
    const previousValue = node.value;

    node.value = getValue(node);

    Promise.all(getAllPredicateResponses())
        .then(() => {
            node.element.removeClass(INVALID_CLASS);
            activeNode.element.addClass(VALID_CLASS);

            tooltip.hide();
        })
        .catch((reason) => {
            node.element.removeClass(VALID_CLASS);
            activeNode.element.addClass(INVALID_CLASS);

            activeNode.value = previousValue;

            if (reason) {
                tooltip.show(reason);
            }
        });
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
        activeNode = node;

        activeNode.element.addClass(VALID_CLASS);

        // Input elements can't have children
        tooltip.setParent(node.element.valueContainer);

        if (node.input === 'color') {
            node.element.valueElement.click();
        } else {
            node.element.valueElement.select();
        }
    }
}

export function mount(node: Child): void {
    const {valueElement, valueContainer, labelContainer} = node.element;

    // Start

    valueElement.addEventListener('focusin', (event) => {
        event.stopPropagation();

        doAction(node);
    });

    // Process new value

    valueContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    if (typeof node.value === 'boolean') {
        valueElement.addEventListener('click', (event) => {
            event.stopPropagation();

            update(node);
        });
    } else {
        valueElement.addEventListener('input', (event) => {
            event.stopPropagation();

            update(node);
        });

        // Stop

        if (node.input === 'color') {
            valueElement.addEventListener('change', () => {
                valueElement.blur();
            });
        }
    }

    valueElement.addEventListener('focusout', (event) => {
        event.stopPropagation();

        reset();
    });

    valueElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation();

            valueElement.blur();

            focusHovered();
        }
    });

    labelContainer?.addEventListener('click', (event) => {
        event.stopPropagation();

        valueContainer.click();
    });
}

export function shouldMount(node: Child): boolean {
    return 'value' in node;
}
