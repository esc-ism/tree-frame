import {ACTION_ID} from './consts';
import TEMPLATE from './button';

import {PROSPECTIVE_CLASS} from '../consts';
import {addActionButton} from '../button';
import * as position from '../position';

import {getSubPredicateResponses} from '../../edit';
import {show as showTooltip} from '../../tooltip';

import type Child from '@nodes/child';

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    position.reset();

    activeNode = undefined;
}

function validate(copy: Child, button: HTMLButtonElement) {
    Promise.all(getSubPredicateResponses(copy.parent))
        .then(() => {
            copy.element.removeClass(PROSPECTIVE_CLASS);

            reset();

            // Show the new node
            copy.element.scrollIntoView();
        })
        .catch((reason) => {
            copy.disconnect();

            if (reason) {
                showTooltip(reason, button);
            }
        });
}

function getCopy(node: Child): Child {
    const copy = node.duplicate();

    copy.element.addClass(PROSPECTIVE_CLASS);

    return copy;
}

function doAction(node: Child, parent, index: number, button: HTMLButtonElement) {
    const copy = getCopy(node);

    copy.move(parent, index);

    validate(copy, button);
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
    const previousNode = activeNode;

    reset();

    if (!isAlt) {
        validate(getCopy(node), button);
    } else if (!previousNode || node !== previousNode) {
        activeNode = node;

        position.mount(node, node, node.parent, node.getSiblings(), ACTION_ID, button, doAction);
    }
}

export function mount(node: Child): void {
    addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Child): boolean {
    return 'seed' in node.parent;
}
