import BUTTON, {BUTTON_SIBLING, BUTTON_PARENT} from './button';
import {ACTION_ID} from './consts';

import {addActionButton} from '../button';
import {setActive} from '../active';
import {focusBranch} from '../focus';
import {getSubPredicateResponse} from '../edit';
import * as tooltip from '../tooltip';

import {FOCUS_CLASS} from '../focus/consts';

import type Root from '../../root';
import type Middle from '../../middle';
import type Child from '../../child';

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

export function reset() {
    if (!moveTarget) {
        return;
    }

    for (const {node, button, isParent} of putTargets) {
        focusBranch(false, node, isParent);

        button.remove();
    }

    focusBranch(false, moveTarget.child, false);

    putTargets.length = 0;

    setActive(moveTarget.child, ACTION_ID, false);

    moveTarget = undefined;
}

function doMove(node, button, isParent) {
    const oldParent = moveTarget.parent;
    const index = moveTarget.child.getIndex();
    const newParent = isParent ? node : node.parent;

    moveTarget.child.move(newParent, isParent ? 0 : node);

    for (const parent of [oldParent, newParent]) {
        const response = getSubPredicateResponse(parent);

        if (response !== true) {
            // Revert
            moveTarget.child.move(oldParent, index);

            if (typeof response === 'string') {
                tooltip.show(response, button);
            }

            return;
        }

        if (oldParent === newParent) {
            break;
        }
    }

    // Grab the reference before it gets wiped
    const movedNode = moveTarget.child;

    reset();

    // Show where the node's been moved to
    movedNode.element.scrollIntoView();
}

function addTargetButton(node, isParent = true) {
    const button = (isParent ? BUTTON_PARENT : BUTTON_SIBLING).cloneNode(true) as HTMLButtonElement;

    button.addEventListener('focus', () => {
        node.element.addClass(FOCUS_CLASS);
    });

    button.addEventListener('blur', () => {
        node.element.removeClass(FOCUS_CLASS);
    });

    button.setAttribute('tabIndex', '1');

    button.addEventListener('click', (event) => {
        event.stopPropagation();

        doMove(node, button, isParent);
    });

    node.element.addButton(button);

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

    // Nodes can't be their own descendents
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

        setActive(node, ACTION_ID);

        focusBranch(true, node);

        addButtons(node.getRoot());

        // If the only valid target is the current parent
        if (putTargets.length < 2) {
            reset();

            tooltip.show('No other valid locations found.', button)
        }
    }
}

export function unmount(node) {
    if (moveTarget && node === moveTarget.child) {
        reset();
    }
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        reset();
    }
});

export function mount(node: Child): void {
    addActionButton(BUTTON, doAction, node);

    node.element.valueElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === 'Escape') {
            event.stopPropagation();

            reset();
        }
    });
}

export function shouldMount(node: Child): boolean {
    return Boolean(node.parent.seed) || ('poolId' in node.parent);
}
