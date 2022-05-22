import BUTTON, {BUTTON_SIBLING, BUTTON_PARENT} from './button';
import {ACTION_ID} from './consts';

import * as tooltip from '../tooltip';
import {addActionButton} from '../button';
import {focus, focusBranch, reset as resetFocus, setTabIndexes} from '../focus';
import {getSubPredicateResponses} from '../edit';
import {addSustained, removeSustained} from '../highlight';
import {PENDING_CLASS} from '../consts';

import type Root from '../../root';
import type Middle from '../../middle';
import type Child from '../../child';

import {setActive as setTreeActive} from '../../../index';

interface PutTarget {
    node: Root | Child;
    button: HTMLButtonElement;
    isParent: boolean;
}

interface MoveTarget {
    child: Child;
    parent: Middle | Root;
    isPooled: boolean;
}

const putTargets: Array<PutTarget> = [];

let moveTarget: MoveTarget;

export function isActive(): boolean {
    return Boolean(moveTarget);
}

export function setActive(node: Child, doActivate = true) {
    const button = node.element.headContainer.querySelector(`.${ACTION_ID}`);

    setTreeActive(button, ACTION_ID, doActivate);

    resetFocus();
    focus(doActivate, node, false);
    focusBranch(doActivate, node, doActivate);

    if (doActivate) {
        setTabIndexes(false, node);

        button.setAttribute('tabIndex', '1');
    } else {
        button.setAttribute('tabIndex', '-1');
    }

    node.element.headContainer.focus();
}

export function reset() {
    if (!moveTarget) {
        return;
    }

    for (const {node, button, isParent} of putTargets) {
        focusBranch(false, node, isParent);

        button.remove();
    }

    putTargets.length = 0;

    setActive(moveTarget.child, false);

    removeSustained(moveTarget.child);

    moveTarget = undefined;
}

function doMove(node, button, isParent) {
    const oldParent = moveTarget.parent;
    const newParent = isParent ? node : node.parent;
    const pending = moveTarget.child.duplicate();

    pending.element.addClass(PENDING_CLASS);

    pending.move(newParent, isParent ? 0 : node);

    moveTarget.child.isActive = false;

    Promise.all([
        ...getSubPredicateResponses(oldParent),
        ...(oldParent === newParent ? [] : getSubPredicateResponses(newParent)),
    ])
        .then(() => {
            pending.element.removeClass(PENDING_CLASS);

            moveTarget.child.disconnect();

            reset();

            // Show where the node's been moved to
            pending.element.scrollIntoView();
        })
        .catch((reason) => {
            moveTarget.child.isActive = pending.isActive;

            pending.disconnect();

            if (reason) {
                tooltip.show(reason, button);
            }
        });
}

function addTargetButton(node, isParent = true) {
    const button = addActionButton(
        isParent ? BUTTON_PARENT : BUTTON_SIBLING,
        () => doMove(node, button, isParent),
        node
    );

    button.setAttribute('tabIndex', '1');

    putTargets.push({node, 'button': button, isParent});
}

function addButtons(parent: Root | Middle) {
    const isCurrentParent = parent === moveTarget.parent;

    if (isCurrentParent || (moveTarget.isPooled && parent.poolId === moveTarget.parent.poolId)) {
        addTargetButton(parent);

        focusBranch(true, parent);

        // todo Check if no longer focusing the target node here has caused problems
        for (const target of isCurrentParent ? moveTarget.child.getSiblings() : parent.children) {
            focusBranch(true, target, false);

            addTargetButton(target, false);
        }
    }

    // Nodes can't be their own descendants
    if (!isCurrentParent) {
        for (const child of parent.children) {
            if ('children' in child) {
                addButtons(child);
            }
        }
    }
}

function doAction(node: Child, button) {
    const toggleOn = !(moveTarget && node === moveTarget.child);

    reset();

    if (toggleOn) {
        moveTarget = {
            'child': node,
            'parent': node.parent,
            'isPooled': 'poolId' in node.parent
        };

        addButtons(node.getRoot());

        addSustained(node);

        // If the only valid target is the current parent
        if (putTargets.length < 2) {
            reset();

            tooltip.show('No other valid locations found.', button)
        } else {
            setActive(node);
        }
    }
}

export function unmount(node) {
    if (moveTarget && node === moveTarget.child) {
        reset();
    }
}

export function mount(node: Child): void {
    addActionButton(BUTTON, doAction, node);
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed) || ('poolId' in node.parent);
}
