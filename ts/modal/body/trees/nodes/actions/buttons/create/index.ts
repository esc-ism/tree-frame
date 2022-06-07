import TEMPLATE from './button';
import {PROSPECTIVE_CLASS} from '../consts';

import {addActionButton} from '../button';
import * as position from '../position';

import {getSubPredicateResponses} from '../../edit';
import {show as showTooltip} from '../../tooltip';

import Middle from '../../../middle';
import Child from '../../../child';
import type Root from '../../../root';
import {ACTION_ID} from './consts';

let activeNode: Root | Middle;

function reset() {
    if (!activeNode) {
        return;
    }

    position.reset();

    activeNode = undefined;
}

function getChild(node: Root | Middle): Child {
    const {seed} = node;
    const child = 'children' in seed ? new Middle(seed, node, 0) : new Child(seed, node, 0);

    child.element.addClass(PROSPECTIVE_CLASS);

    return child;
}

function doAction(source: Middle | Root, parent: Middle | Root, index: number, button: HTMLButtonElement) {
    const child = getChild(source);

    child.move(parent, index);

    Promise.all(getSubPredicateResponses(parent))
        .then(() => {
            child.element.removeClass(PROSPECTIVE_CLASS);

            child.isActive = true;

            reset();

            // Show the new node
            child.element.scrollIntoView();
        })
        .catch((reason) => {
            child.disconnect();

            if (reason) {
                showTooltip(reason, button);
            }
        });
}

function onClick(node: Root | Middle, button: HTMLButtonElement, isAlt: boolean) {
    const previousNode = activeNode;

    reset();

    if (!isAlt) {
        doAction(node, node, 0, button);
    } else if (!previousNode || node !== previousNode) {
        activeNode = node;

        position.mount(node, node.seed, node, node.children, ACTION_ID, button, doAction, false);
    }
}

export function mount(node: Root | Middle): void {
    addActionButton(TEMPLATE, onClick, node);
}

export function shouldMount(node: Root | Middle): boolean {
    return 'seed' in node;
}
