import {INVALID_CLASS} from './consts';

import * as tooltip from '../tooltip';
import {reset as resetFocus} from '../focus';

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

    activeNode.element.removeClass(INVALID_CLASS);

    tooltip.reset();

    activeNode.element.valueElement.blur();

    resetFocus();

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

export function update() {
    const previousValue = activeNode.value;

    activeNode.value = getValue(activeNode);

    Promise.all(getAllPredicateResponses())
        .then(() => {
            activeNode.element.removeClass(INVALID_CLASS);

            tooltip.hide();
        })
        .catch((reason) => {
            activeNode.value = previousValue;

            activeNode.element.addClass(INVALID_CLASS);

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

        tooltip.setParent(node.element.valueElement);

        if (node.input === 'color') {
            node.element.valueElement.click();
        } else {
            node.element.valueElement.select();
        }
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        reset();
    }
});

export function mount(node: Child): void {
    if (typeof node.value === 'boolean') {
        const checkbox = node.element.valueElement;

        // Flip value

        checkbox.addEventListener('click', (event) => {
            event.stopPropagation();

            node.value = checkbox.checked;

            Promise.all(getAllPredicateResponses(node))
                .catch((reason) => {
                    node.value = !node.value;

                    checkbox.checked = node.value;

                    if (reason) {
                        tooltip.show(reason, node.element.valueWrapper);
                    }
                });
        });

        node.element.valueContainer.addEventListener('click', (event) => {
            event.stopPropagation();

            checkbox.click();
        });
    } else {
        // Start

        node.element.valueElement.addEventListener('focusin', (event) => {
            event.stopPropagation();

            doAction(node);
        });

        node.element.valueContainer.addEventListener('click', (event) => {
            event.stopPropagation();

            node.element.valueElement.focus();
        });

        // Process new value

        node.element.valueElement.addEventListener('input', update);

        // Stop

        node.element.valueElement.addEventListener('focusout', (event) => {
            event.stopPropagation();

            reset();
        });

        if (node.input === 'color') {
            node.element.valueElement.addEventListener('change', () => {
                node.element.valueElement.blur();
            });
        }

        node.element.valueElement.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                event.stopPropagation();

                node.element.valueElement.blur();
            }
        });
    }

    node.element.labelElement?.addEventListener('click', (event) => {
        event.stopPropagation();

        node.element.valueContainer.click();
    });
}

export function shouldMount(node: Child): boolean {
    return 'value' in node;
}
