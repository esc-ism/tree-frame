import BUTTON from './button';
import {ACTION_ID} from './consts';

import * as position from '../position';
import {addActionButton} from '../button';
import {PROSPECTIVE_CLASS} from '../consts';

import * as tooltip from '../../tooltip';
import {getSubPredicateResponses} from '../../edit';

import type Child from '../../../child';

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    position.reset();

    activeNode = undefined;
}

function doAction(node: Child, newParent, index, button) {
    const oldParent = node.parent;
    const copy = node.duplicate();

    copy.element.addClass(PROSPECTIVE_CLASS);

    copy.move(newParent, index);

    node.isActive = false;

    Promise.all([
        ...getSubPredicateResponses(oldParent),
        ...(oldParent === newParent ? [] : getSubPredicateResponses(newParent))
    ])
        .then(() => {
            copy.element.removeClass(PROSPECTIVE_CLASS);

            node.disconnect();

            reset();

            // Show where the node's been moved to
            copy.element.scrollIntoView();
        })
        .catch((reason) => {
            node.isActive = copy.isActive;

            copy.disconnect();

            if (reason) {
                tooltip.show(reason, button);
            }
        });
}

function onClick(node: Child, button: HTMLButtonElement, isAlt: boolean) {
    const previousNode = activeNode;

    reset();

    if (!isAlt) {
        const newIndex = node.getIndex() + 2;

        if (newIndex < node.parent.children.length + 1) {
            doAction(node, node.parent, newIndex, button);
        } else {
            tooltip.show('Node can not be moved down.', button);
        }
    } else if (!previousNode || node !== previousNode) {
        // If the only valid target is the current parent
        if (position.hasDestinations(node)) {
            activeNode = node;

            position.mount(node, node, node.parent, node.getSiblings(), ACTION_ID, button, doAction, false);
        } else {
            tooltip.show('No other valid locations found.', button);
        }
    }
}

export function unmount(node) {
    if (activeNode && node === activeNode) {
        reset();
    }
}

export function mount(node: Child): void {
    addActionButton(BUTTON, onClick, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed) || ('poolId' in node.parent);
}
