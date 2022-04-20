import TEMPLATE from './button';
import {ACTION_ID, INVALID_CLASS} from './consts';

import * as tooltip from '../tooltip';
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

    tooltip.reset();

    activeNode = undefined;
}

function getPredicateResponse(...predicates: Array<(...args: any) => unknown>): boolean | string {
    for (const predicate of predicates) {
        const response = predicate();

        if (typeof response === 'string') {
            return response;
        }

        if (!Boolean(response)) {
            return false;
        }
    }

    return true;
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

function getDescendantPredicateResponse(parent: Root | Middle): boolean | string {
    if (parent.descendantPredicate) {
        return getPredicateResponse(() => parent.descendantPredicate(parent.children));
    }

    if ('parent' in parent) {
        return getDescendantPredicateResponse(parent.parent);
    }

    return true;
}

function getChildPredicateResponse({childPredicate, children}: Root | Middle): boolean | string {
    if (childPredicate) {
        return getPredicateResponse(() => childPredicate(children));
    }

    return true;
}

export function getSubPredicateResponse(parent): boolean | string {
    return getPredicateResponse(
        () => getChildPredicateResponse(parent),
        () => getDescendantPredicateResponse(parent)
    );
}

function getOwnPredicateResponse(node: Child): boolean | string {
    const {predicate} = node;
    const value = getValue(node);

    switch (typeof predicate) {
        case 'boolean':
            return predicate;

        case 'function':
            return getPredicateResponse(() => predicate(value));

        default:
            return predicate.indexOf(value as string) !== -1;
    }
}

function getAllPredicateResponse(node: Child = activeNode): boolean | string {
    return getPredicateResponse(
        () => getOwnPredicateResponse(node),
        () => getSubPredicateResponse(node.parent)
    );
}

export function update() {
    const previousValue = activeNode.value;

    activeNode.value = getValue(activeNode);

    const response = getAllPredicateResponse();

    if (response === true) {
        activeNode.element.removeClass(INVALID_CLASS);
    } else {
        activeNode.value = previousValue;

        activeNode.element.addClass(INVALID_CLASS);

        if (typeof response === 'string') {
            tooltip.show(response);

            return;
        }
    }

    tooltip.hide();
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

            const response = getAllPredicateResponse(node);

            if (response === true) {
                node.element.render(node.value);
            } else {
                node.value = !node.value;

                if (typeof response === 'string') {
                    tooltip.show(response, button);
                }
            }
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
