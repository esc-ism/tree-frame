import BUTTON, {BUTTON_SIBLING, BUTTON_PARENT} from './button';
import {ACTION_ID} from './consts';

import {addActionButton} from '../button';
import {setActive} from '../active';
import {focusBranch} from '../focus';

import type Root from '../../root';
import type Middle from '../../middle';
import type Child from '../../child';

import {validateSeedMatch} from '../../../../../../validation';
import {FOCUS_CLASS} from '../focus/consts';
import {passesSubPredicates} from '../edit';

const targets = [];

let activeNode: Child;

export function reset() {
    if (!activeNode) {
        return;
    }

    for (const {node, button, isParent} of targets) {
        focusBranch(false, node, isParent);

        button.remove();
    }

    focusBranch(false, activeNode, false);

    targets.length = 0;

    setActive(activeNode, ACTION_ID, false);

    activeNode = undefined;
}

function isSeedMatch(seed) {
    try {
        validateSeedMatch([], [], seed, activeNode.getJSON());

        return true;
    } catch (e) {
        return false;
    }
}

function doMove(node, isParent) {
    const revert = activeNode.move.bind(activeNode, activeNode.parent, activeNode.getIndex());
    const parent = isParent ? node : node.parent;

    activeNode.move(parent, isParent ? 0 : node.getIndex() + 1);

    if (!passesSubPredicates(parent)) {
        revert();
    }

    // Grab the reference before activeNode is wiped
    const previousNode = activeNode;

    reset();

    // Show where the node's been moved to
    previousNode.element.scrollIntoView();
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

        doMove(node, isParent);
    });

    node.element.addButton(button);

    targets.push({node, 'button': button, isParent});
}

function addButtons(parent: Root | Middle) {
    const isCurrentParent = parent === activeNode.parent;

    if (isCurrentParent || ('seed' in parent && isSeedMatch(parent.seed))) {
        addTargetButton(parent);

        focusBranch(true, parent);

        if (isCurrentParent) {
            for (const child of parent.children) {
                focusBranch(true, child, false);

                if (child !== activeNode) {
                    addTargetButton(child, false);
                }
            }
        } else {
            for (const child of parent.children) {
                focusBranch(true, child, false);

                addTargetButton(child, false);
            }
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

function doAction(node: Child) {
    const toggleOn = node !== activeNode;

    reset();

    if (toggleOn) {
        activeNode = node;

        setActive(activeNode, ACTION_ID);

        addButtons(activeNode.getRoot());
    }
}

export function unmount(node) {
    if (node === activeNode) {
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
    return Boolean(node.parent.seed);
}
