import TEMPLATE from './button';
import {ACTION_ID, INVALID_CLASS} from './consts';

import * as tooltip from '../tooltip';
import {addActionButton} from '../button';
import {setActive} from '../active';

import type Child from '../../child';
import type Middle from '../../middle';
import type Root from '../../root';
import {getPredicateResponse, resolvePredicatePromise} from '../../../../../../messaging';
import {SubPredicate} from '../../../../../../validation/types';

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

    tooltip.reset();

    activeNode = undefined;
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
    // No need to check for undefined - the button wouldn't have mounted if there were no predicate
    const {predicate} = node;
    const value = getValue(node);

    switch (typeof predicate) {
        case 'boolean':
            return Promise[predicate ? 'resolve' : 'reject']();

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

export function doAction(node, button) {
    const previousNode = activeNode;

    reset();

    if (previousNode !== node) {
        if (typeof node.value === 'boolean') {
            node.value = !node.value;

            Promise.all(getAllPredicateResponses(node))
                .then(() => {
                    node.element.render(node.value);
                })
                .catch((reason) => {
                    node.value = !node.value;

                    if (reason) {
                        tooltip.show(reason, button);
                    }
                });
        } else {
            activeNode = node;

            tooltip.setParent(node.element.interactionContainer);

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
    switch (typeof node.predicate) {
        case 'undefined':
            return false;

        case 'boolean':
            return node.predicate;

        case 'object':
            // Prevent editing if there are no other valid values
            return node.predicate.length > 1;

        default:
            return true;
    }
}
